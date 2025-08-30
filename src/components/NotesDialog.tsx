import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemName: string;
  topicId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const NotesDialog = ({ 
  isOpen, 
  onClose, 
  problemId, 
  problemName, 
  topicId,
  difficulty 
}: NotesDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing notes when dialog opens
  useEffect(() => {
    const loadNotes = async () => {
      if (!isOpen || !user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('notes')
          .eq('user_id', user.id)
          .eq('problem_id', problemId)
          .eq('topic_id', topicId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading notes:', error);
          return;
        }

        setNotes(data?.notes || '');
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [isOpen, user, problemId, topicId]);

  const saveNotes = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          problem_id: problemId,
          topic_id: topicId,
          notes: notes.trim(),
        });

      if (error) throw error;

      toast({
        title: "Notes saved",
        description: "Your notes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error saving notes",
        description: "Failed to save your notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setNotes('');
    onClose();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <DialogTitle className="text-xl">Notes & Solutions</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{problemName}</h3>
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          </div>
          <DialogDescription>
            Add your notes, solutions, thoughts, or any insights about this problem.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Write your notes, solution approach, time complexity, space complexity, edge cases, or any insights..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              
              <div className="text-sm text-muted-foreground">
                {notes.length > 0 
                  ? `${notes.length} characters`
                  : 'Start writing your notes...'
                }
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
          <Button
            onClick={saveNotes}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Notes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;