import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bot, ChevronDown, ChevronUp, Copy, FileCode, Loader2, Play, Terminal, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  language?: string;
}

function CodeEditor({ code, onChange, onKeyDown, language = "python" }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      onKeyDown?.(e);
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [onKeyDown]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Calculate line numbers
  const lines = code.split('\n');
  const lineNumbers = lines.map((_, index) => index + 1);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center space-x-2">
            <FileCode className="text-blue-400" size={16} />
            <span className="text-sm font-mono text-gray-400">
              {language === 'java' ? 'Main.java' : 'main.py'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{language === 'java' ? 'Java 21' : 'Python 3.11'}</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>UTF-8</span>
        </div>
      </div>
      
      {/* Code Editor Area */}
      <div className="relative bg-gray-900">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-700 flex flex-col text-gray-500 text-sm font-mono pt-4 pb-4 select-none">
          {lineNumbers.map((lineNum) => (
            <div key={lineNum} className="h-6 flex items-center justify-end pr-3 leading-6">
              {lineNum}
            </div>
          ))}
        </div>
        
        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[300px] pl-16 pr-4 py-4 bg-transparent text-gray-100 font-mono text-sm resize-none outline-none leading-6"
          style={{
            fontFamily: "'Fira Code', 'SF Mono', 'Monaco', 'Cascadia Code', monospace"
          }}
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}

interface OutputPanelProps {
  output: string;
  hasError?: boolean;
  onCopy?: () => void;
  onClear?: () => void;
}

function OutputPanel({ output, hasError = false, onCopy, onClear }: OutputPanelProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      {/* Output Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Terminal className="text-blue-400" size={16} />
            <span className="font-medium text-gray-100">Output</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span>{hasError ? 'Execution failed' : 'Execution completed'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onClear && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClear}
              className="p-1.5 text-gray-400 hover:text-gray-100 transition-colors"
              title="Clear Output"
            >
              <X size={14} />
            </Button>
          )}
          {onCopy && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onCopy}
              className="p-1.5 text-gray-400 hover:text-gray-100 transition-colors"
              title="Copy Output"
            >
              <Copy size={14} />
            </Button>
          )}
        </div>
      </div>
      
      {/* Output Content */}
      <div className="p-4 font-mono text-sm min-h-[120px] bg-gray-900">
        <pre className={`whitespace-pre-wrap ${hasError ? 'text-red-400' : 'text-gray-100'}`}>
          {output || 'No output yet. Run your code to see results here.'}
        </pre>
      </div>
    </div>
  );
}

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
      >
        <span>{languages.find(lang => lang.value === language)?.icon}</span>
        <span>{languages.find(lang => lang.value === language)?.label}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                onLanguageChange(lang.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-700 transition-colors ${
                language === lang.value ? 'bg-gray-700 text-blue-400' : 'text-gray-100'
              }`}
            >
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IntegratedCodeEditor() {
  const [code, setCode] = useState(`# Welcome to the Code Editor!
# Write your Python code here

print("Hello, World!")
print("This is a Python code editor with real-time execution.")

# Try some basic operations
x = 10
y = 5
print(f"Sum: {x + y}")
print(f"Product: {x * y}")`);
  
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleRunCode = async () => {
    setIsLoading(true);
    setHasError(false);
    setOutput('Executing code...');
    setExecutionTime(null);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        setExecutionTime(data.executionTime);
        setHasError(false);
      } else {
        setOutput(data.error || 'Execution failed');
        setHasError(true);
      }
    } catch (error) {
      setOutput('Network error: Could not connect to the server');
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const handleClearOutput = () => {
    setOutput('');
    setHasError(false);
    setExecutionTime(null);
    setAiExplanation('');
    setShowAiExplanation(false);
  };

  const handleGetAiHelp = async () => {
    if (!hasError || !output) return;
    
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          error: output
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiExplanation(data.explanation);
        setShowAiExplanation(true);
      } else {
        setAiExplanation('Sorry, I encountered an error while generating the explanation. Please try again.');
        setShowAiExplanation(true);
      }
    } catch (error) {
      setAiExplanation('Network error: Could not connect to the AI service.');
      setShowAiExplanation(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCloseAiExplanation = () => {
    setShowAiExplanation(false);
    setAiExplanation('');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (newLanguage === 'java') {
      setCode(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("This is a Java code editor with real-time execution.");
        
        // Try some basic operations
        int x = 10;
        int y = 5;
        System.out.println("Sum: " + (x + y));
        System.out.println("Product: " + (x * y));
    }
}`);
    } else {
      setCode(`# Welcome to the Code Editor!
# Write your Python code here

print("Hello, World!")
print("This is a Python code editor with real-time execution.")

# Try some basic operations
x = 10
y = 5
print(f"Sum: {x + y}")
print(f"Product: {x * y}")`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Editor</h1>
          <p className="text-gray-400">Write, execute, and see results instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Code</h2>
              <div className="flex items-center space-x-3">
                <LanguageSelector 
                  language={language} 
                  onLanguageChange={handleLanguageChange} 
                />
                <Button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isLoading ? 'Running...' : 'Run Code'}
                </Button>
              </div>
            </div>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Output</h2>
              {executionTime && (
                <span className="text-sm text-gray-400">
                  Execution time: {executionTime}ms
                </span>
              )}
            </div>
            <OutputPanel
              output={output}
              hasError={hasError}
              onCopy={handleCopyOutput}
              onClear={handleClearOutput}
            />

            {/* AI Explanation Section */}
            {hasError && !showAiExplanation && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleGetAiHelp}
                  disabled={isAiLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200"
                  size="sm"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      <span>AI is thinking...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2" size={16} />
                      <span>Get AI Help</span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* AI Explanation Display */}
            {showAiExplanation && (
              <Card className="bg-blue-950/20 border-blue-500/30 mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-blue-300">
                    <div className="flex items-center space-x-2">
                      <Bot size={20} />
                      <span>AI Explanation</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseAiExplanation}
                      className="text-blue-300 hover:text-blue-100 hover:bg-blue-800/30"
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-100 leading-relaxed">
                  {aiExplanation ? (
                    <div className="whitespace-pre-wrap">{aiExplanation}</div>
                  ) : (
                    <div className="flex items-center space-x-2 text-blue-300">
                      <AlertCircle size={16} />
                      <span>No explanation available.</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
