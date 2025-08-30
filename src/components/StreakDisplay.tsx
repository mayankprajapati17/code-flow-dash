import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

const StreakDisplay = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStreakData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('current_streak, longest_streak, last_activity_date')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading streak data:', error);
          return;
        }

        setStreakData(data || { current_streak: 0, longest_streak: 0, last_activity_date: null });
      } catch (error) {
        console.error('Error loading streak data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStreakData();
  }, [user]);

  if (loading || !streakData) {
    return null;
  }

  const isStreakActive = () => {
    if (!streakData.last_activity_date) return false;
    const lastActivity = new Date(streakData.last_activity_date);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    return (
      lastActivity.toDateString() === today.toDateString() ||
      lastActivity.toDateString() === yesterday.toDateString()
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Current Streak */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: isStreakActive() && streakData.current_streak > 0 ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isStreakActive() && streakData.current_streak > 0 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <Flame 
                    className={`h-6 w-6 ${
                      isStreakActive() && streakData.current_streak > 0 
                        ? 'text-orange-500' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </motion.div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {streakData.current_streak}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current Streak
                  </div>
                </div>
              </div>

              {/* Longest Streak */}
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {streakData.longest_streak}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Best Streak
                  </div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {streakData.last_activity_date
                    ? `Last active: ${new Date(streakData.last_activity_date).toLocaleDateString()}`
                    : 'No activity yet'
                  }
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <Badge 
              variant={isStreakActive() && streakData.current_streak > 0 ? "default" : "secondary"}
              className="ml-4"
            >
              {isStreakActive() && streakData.current_streak > 0 ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StreakDisplay;