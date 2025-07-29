-- Create indexes for better performance on user_interactions table
-- These indexes will improve query performance for the follow/like functionality

-- Index for album interactions
CREATE INDEX IF NOT EXISTS idx_user_interactions_album ON public.user_interactions(target_id) WHERE target_type = 'album';

-- Index for artist interactions  
CREATE INDEX IF NOT EXISTS idx_user_interactions_artist ON public.user_interactions(target_id) WHERE target_type = 'artist';

-- Index for track interactions
CREATE INDEX IF NOT EXISTS idx_user_interactions_track ON public.user_interactions(target_id) WHERE target_type = 'track';

-- Composite index for user interactions by type
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_type ON public.user_interactions(user_id, target_type, interaction_type);

-- Index for checking specific interactions
CREATE INDEX IF NOT EXISTS idx_user_interactions_check ON public.user_interactions(user_id, target_id, target_type, interaction_type); 