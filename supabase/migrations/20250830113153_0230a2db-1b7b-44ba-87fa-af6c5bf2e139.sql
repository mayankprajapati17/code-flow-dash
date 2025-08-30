-- Add streak tracking and notes fields to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN notes TEXT,
ADD COLUMN last_activity_date DATE;

-- Create user_streaks table to track streak information
CREATE TABLE public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on user_streaks table
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_streaks
CREATE POLICY "Users can view their own streaks" 
ON public.user_streaks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks" 
ON public.user_streaks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" 
ON public.user_streaks 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update streaks when problems are completed
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update streak if problem was completed (not unchecked)
    IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
        -- Update or insert user streak
        INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date)
        VALUES (
            NEW.user_id,
            CASE 
                WHEN (SELECT last_activity_date FROM public.user_streaks WHERE user_id = NEW.user_id) = CURRENT_DATE THEN
                    -- Same day, don't increment
                    (SELECT current_streak FROM public.user_streaks WHERE user_id = NEW.user_id)
                WHEN (SELECT last_activity_date FROM public.user_streaks WHERE user_id = NEW.user_id) = CURRENT_DATE - INTERVAL '1 day' THEN
                    -- Consecutive day, increment streak
                    (SELECT current_streak FROM public.user_streaks WHERE user_id = NEW.user_id) + 1
                ELSE
                    -- Streak broken or first activity, start at 1
                    1
            END,
            GREATEST(
                COALESCE((SELECT longest_streak FROM public.user_streaks WHERE user_id = NEW.user_id), 0),
                CASE 
                    WHEN (SELECT last_activity_date FROM public.user_streaks WHERE user_id = NEW.user_id) = CURRENT_DATE THEN
                        (SELECT current_streak FROM public.user_streaks WHERE user_id = NEW.user_id)
                    WHEN (SELECT last_activity_date FROM public.user_streaks WHERE user_id = NEW.user_id) = CURRENT_DATE - INTERVAL '1 day' THEN
                        (SELECT current_streak FROM public.user_streaks WHERE user_id = NEW.user_id) + 1
                    ELSE
                        1
                END
            ),
            CURRENT_DATE
        )
        ON CONFLICT (user_id) DO UPDATE SET
            current_streak = CASE 
                WHEN user_streaks.last_activity_date = CURRENT_DATE THEN
                    -- Same day, don't increment
                    user_streaks.current_streak
                WHEN user_streaks.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
                    -- Consecutive day, increment streak
                    user_streaks.current_streak + 1
                ELSE
                    -- Streak broken, start at 1
                    1
            END,
            longest_streak = GREATEST(
                user_streaks.longest_streak,
                CASE 
                    WHEN user_streaks.last_activity_date = CURRENT_DATE THEN
                        user_streaks.current_streak
                    WHEN user_streaks.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
                        user_streaks.current_streak + 1
                    ELSE
                        1
                END
            ),
            last_activity_date = CURRENT_DATE,
            updated_at = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update streaks
CREATE TRIGGER trigger_update_user_streak
    AFTER INSERT OR UPDATE OF completed ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_streak();

-- Add trigger for updated_at on user_streaks
CREATE TRIGGER update_user_streaks_updated_at
    BEFORE UPDATE ON public.user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();