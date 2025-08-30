-- Fix security issue: Add search_path to functions
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
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
$$;

-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;