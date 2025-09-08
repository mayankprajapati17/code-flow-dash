import { motion } from 'framer-motion';
import { Play, Code, Terminal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import codeEditorPreview from '@/assets/code-editor-preview.jpg';
import { launchAlgolearnWeb } from '@/utils/launchAlgolearnWeb';

const CodeExecutionPreview = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="code-execution">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Run <span className="text-gradient">Python & Java</span> Code in Real-Time
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Write, execute, and see results instantly. Our secure sandboxing environment
            provides real-time output with lightning-fast performance.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 lg:p-12 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-primary"></div>
          </div>

          <div className="relative z-10">
            {/* Code Editor Preview */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-secondary rounded-xl blur-2xl opacity-20"></div>
              <img
                src={codeEditorPreview}
                alt="Code Editor with Real-time Output"
                className="relative z-10 w-full rounded-xl shadow-2xl border border-white/10"
              />
              
              {/* Overlay Features */}
              <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Real-time Execution</span>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="feature-card text-center"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Execution</h3>
                <p className="text-muted-foreground text-sm">
                  See your code results in milliseconds with our optimized runtime environment.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="feature-card text-center"
              >
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
                <p className="text-muted-foreground text-sm">
                  Support for Python and Java with syntax highlighting and auto-completion.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="feature-card text-center"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Sandbox</h3>
                <p className="text-muted-foreground text-sm">
                  Safe execution environment with resource limits and security controls.
                </p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Button 
                className="hero-button group" 
                onClick={() => launchAlgolearnWeb()}
              >
                <Play className="mr-2 h-4 w-4" />
                Try Code Editor
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CodeExecutionPreview;