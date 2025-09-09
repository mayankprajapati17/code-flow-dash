import { spawn } from "child_process";
import type { Express } from "express";
import fs from "fs";
import { createServer, type Server } from "http";
import os from "os";
import path from "path";
import { z } from "zod";

// Schema definitions
const executeCodeSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['python', 'java'])
});

const explainErrorSchema = z.object({
  code: z.string().min(1),
  language: z.enum(['python', 'java']),
  error: z.string().min(1)
});

// Helper function to generate fallback explanations for common errors
function generateFallbackExplanation(language: string, error: string): string {
  const errorText = error.toLowerCase();
  
  if (language === 'python') {
    if (errorText.includes('typeerror') && errorText.includes('concatenate str')) {
      return `## TypeError: String Concatenation Issue

**What went wrong:**
You're trying to combine a string with a number using the + operator, but Python can't automatically convert numbers to strings.

**The Fix:**
Convert the number to a string using \`str()\`:

\`\`\`python
age = 25
print("My age is " + str(age))  # Convert age to string
\`\`\`

**Alternative approach:**
Use f-strings (recommended):
\`\`\`python
age = 25
print(f"My age is {age}")  # f-string automatically handles conversion
\`\`\``;
    }
    
    if (errorText.includes('nameerror')) {
      return `## NameError: Variable Not Defined

**What went wrong:**
You're trying to use a variable that hasn't been defined yet, or there might be a typo in the variable name.

**The Fix:**
1. Check if the variable name is spelled correctly
2. Make sure you've defined the variable before using it
3. Check for proper indentation if inside a function or loop`;
    }
    
    if (errorText.includes('syntaxerror')) {
      return `## SyntaxError: Code Structure Issue

**What went wrong:**
There's a problem with how your code is written - missing brackets, colons, or incorrect indentation.

**Common fixes:**
1. Check for missing colons (:) after if/for/while statements
2. Ensure proper indentation (4 spaces per level)
3. Match opening and closing brackets/parentheses`;
    }
  }
  
  if (language === 'java') {
    // Check for compilation errors first (most common)
    if (errorText.includes('compilation error') || errorText.includes('javac') || errorText.includes(';\" expected') || errorText.includes('\" expected') || errorText.includes('syntax error')) {
      return `## Java Compilation Error

**What went wrong:**
Your Java code has syntax errors that prevent it from compiling.

**Common issues:**
1. Missing semicolons (;) at the end of statements
2. Mismatched brackets { }
3. Incorrect variable declarations
4. Missing class structure

**Example of correct structure:**
\`\`\`java
public class Main {
    public static void main(String[] args) {
        int number = 42;
        System.out.println("Number: " + number);
    }
}
\`\`\`

**Quick fixes:**
- Make sure every statement ends with a semicolon
- Check that all brackets are properly matched
- Ensure your code is inside the Main class structure`;
    }
    
    if (errorText.includes('cannot find symbol')) {
      return `## Cannot Find Symbol Error

**What went wrong:**
Java can't find a variable, method, or class you're trying to use.

**Common fixes:**
1. Check spelling of variable/method names
2. Make sure variables are declared before use
3. Import required classes at the top of your file

**Example fix:**
\`\`\`java
public class Main {
    public static void main(String[] args) {
        int age = 25;  // Declare the variable first
        System.out.println("My age is " + age);
    }
}
\`\`\``;
    }
    
    if (errorText.includes('class, interface, or enum expected')) {
      return `## Class Structure Error

**What went wrong:**
Your code structure doesn't match Java's requirements. Java code must be inside a class.

**The Fix:**
Wrap your code in a proper class structure:
\`\`\`java
public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello World!");
    }
}
\`\`\``;
    }
    
    if (errorText.includes('public class') && errorText.includes('should be declared')) {
      return `## Class Name Mismatch

**What went wrong:**
The class name in your code doesn't match the expected filename.

**The Fix:**
In our system, always use "Main" as your class name:
\`\`\`java
public class Main {  // Must be "Main"
    public static void main(String[] args) {
        // Your code here
    }
}
\`\`\``;
    }
    
    if (errorText.includes('variable') && errorText.includes('might not have been initialized')) {
      return `## Variable Not Initialized

**What went wrong:**
You're trying to use a variable before giving it a value.

**The Fix:**
Initialize variables before using them:
\`\`\`java
public class Main {
    public static void main(String[] args) {
        int count = 0;  // Initialize first
        System.out.println("Count: " + count);
    }
}
\`\`\``;
    }
  }
  
  return `## Code Error Detected

**What happened:**
Your code encountered an error during execution. Here are some general debugging tips:

1. **Read the error message carefully** - it often tells you exactly what's wrong
2. **Check the line number** mentioned in the error
3. **Look for typos** in variable names and syntax
4. **Verify proper syntax** for ${language}

**Need more help?**
Try simplifying your code to identify exactly where the error occurs, then build it back up step by step.`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Execute code endpoint (supports both Python and Java)
  app.post("/api/execute", async (req, res) => {
    try {
      const { code, language } = executeCodeSchema.parse(req.body);
      
      const startTime = Date.now();
      let output = '';
      let error = '';
      let hasResponded = false;

      // Helper function to send response only once
      const sendResponse = (responseData: any) => {
        if (!hasResponded) {
          hasResponded = true;
          res.json(responseData);
        }
      };

      if (language === 'python') {
        // Execute Python code
        const pythonProcess = spawn('python3', ['-c', code], {
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 10000, // 10 second timeout
        });

        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });

        pythonProcess.on('close', (exitCode) => {
          const executionTime = Date.now() - startTime;
          
          if (exitCode === 0) {
            sendResponse({
              output: output.trim() || 'Code executed successfully (no output)',
              executionTime
            });
          } else {
            sendResponse({
              output: '',
              error: error.trim() || 'Code execution failed',
              executionTime
            });
          }
        });

        pythonProcess.on('error', (err) => {
          const executionTime = Date.now() - startTime;
          sendResponse({
            output: '',
            error: `Execution error: ${err.message}`,
            executionTime
          });
        });

      } else if (language === 'java') {
        // Execute Java code
        const tempDir = path.join(os.tmpdir(), `java-run-${Date.now()}`);
        const javaFilePath = path.join(tempDir, 'Main.java');
        
        try {
          // Create temp directory and write Java file
          fs.mkdirSync(tempDir, { recursive: true });
          fs.writeFileSync(javaFilePath, code);

          // Compile Java code
          const compileProcess = spawn('javac', [javaFilePath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
          });

          let compileError = '';
          compileProcess.stderr.on('data', (data) => {
            compileError += data.toString();
          });

          compileProcess.on('close', (compileExitCode) => {
            if (compileExitCode !== 0) {
              // Compilation failed
              const executionTime = Date.now() - startTime;
              // Clean up
              fs.rmSync(tempDir, { recursive: true, force: true });
              sendResponse({
                output: '',
                error: `Compilation error: ${compileError.trim() || 'Java compilation failed'}`,
                executionTime
              });
              return;
            }

            // Run compiled Java code
            const runProcess = spawn('java', ['-cp', tempDir, 'Main'], {
              stdio: ['pipe', 'pipe', 'pipe'],
              timeout: 10000,
            });

            runProcess.stdout.on('data', (data) => {
              output += data.toString();
            });

            runProcess.stderr.on('data', (data) => {
              error += data.toString();
            });

            runProcess.on('close', (runExitCode) => {
              const executionTime = Date.now() - startTime;
              
              // Clean up temp directory
              fs.rmSync(tempDir, { recursive: true, force: true });

              if (runExitCode === 0) {
                sendResponse({
                  output: output.trim() || 'Code executed successfully (no output)',
                  executionTime
                });
              } else {
                sendResponse({
                  output: '',
                  error: error.trim() || 'Java execution failed',
                  executionTime
                });
              }
            });

            runProcess.on('error', (err) => {
              const executionTime = Date.now() - startTime;
              // Clean up
              fs.rmSync(tempDir, { recursive: true, force: true });
              sendResponse({
                output: '',
                error: `Java execution error: ${err.message}`,
                executionTime
              });
            });
          });

          compileProcess.on('error', (err) => {
            const executionTime = Date.now() - startTime;
            // Clean up
            fs.rmSync(tempDir, { recursive: true, force: true });
            sendResponse({
              output: '',
              error: `Java compilation error: ${err.message}`,
              executionTime
            });
          });

        } catch (fsError: any) {
          const executionTime = Date.now() - startTime;
          sendResponse({
            output: '',
            error: `File system error: ${fsError.message}`,
            executionTime
          });
        }
      } else {
        sendResponse({
          output: '',
          error: `Language '${language}' not supported`,
          executionTime: Date.now() - startTime
        });
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // AI explanation endpoint with enhanced AI integration
  app.post("/api/explain", async (req, res) => {
    try {
      const { code, language, error } = explainErrorSchema.parse(req.body);

      // Try to get AI explanation first
      try {
        const aiResponse = await chat({
          messages: [
            {
              role: "system",
              content: `You are an expert programming tutor. Explain the error in the ${language} code in a clear, helpful way. Provide specific fixes and examples.`
            },
            {
              role: "user",
              content: `Code: ${code}\n\nError: ${error}\n\nPlease explain this error and provide a solution.`
            }
          ],
          model: "gpt-4",
          temperature: 0.3,
        });

        if (aiResponse && aiResponse.content) {
          res.json({ explanation: aiResponse.content });
          return;
        }
      } catch (aiError) {
        console.log("AI explanation failed, using fallback:", aiError);
      }

      // Fallback to generated explanation
      const fallbackExplanation = generateFallbackExplanation(language, error);
      res.json({ explanation: fallbackExplanation });

    } catch (error) {
      console.error("Explanation endpoint error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ explanation: "Invalid request data provided." });
      } else {
        // Provide helpful fallback explanation instead of generic error
        const fallbackExplanation = generateFallbackExplanation(req.body.language || "python", req.body.error || "");
        res.json({ explanation: fallbackExplanation });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
