import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IntegratedCodeEditor from '@/components/IntegratedCodeEditor';

const CodeEditor = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="relative">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={handleBackToHome}
          variant="outline"
          className="glass border-white/20 text-foreground hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Integrated Code Editor */}
      <IntegratedCodeEditor />
    </div>
  );
};

export default CodeEditor; 