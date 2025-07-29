-- Music Platform Database Schema
-- Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('User', 'Artist')),
    aka TEXT,
    bio TEXT,
    profile_picture_url TEXT,
    location TEXT,
    genre TEXT,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist verification table
CREATE TABLE public.artist_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('not_applied', 'pending', 'verified', 'rejected')),
    application_data JSONB NOT NULL DEFAULT '{}',
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Albums table
CREATE TABLE public.albums (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    genre TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_public BOOLEAN DEFAULT true,
    total_duration INTEGER DEFAULT 0, -- in seconds
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks table
CREATE TABLE public.tracks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    track_number INTEGER NOT NULL,
    is_explicit BOOLEAN DEFAULT false,
    audio_file_url TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions (likes, follows)
CREATE TABLE public.user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('album', 'track', 'artist')),
    target_id UUID NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'follow')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id, interaction_type)
);

-- Album purchases
CREATE TABLE public.album_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, album_id)
);

-- Events table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    artist_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    venue TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_capacity INTEGER NOT NULL,
    tickets_sold INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event bookings
CREATE TABLE public.event_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    tickets_count INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Artist earnings
CREATE TABLE public.artist_earnings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('album_sale', 'event_ticket')),
    source_id UUID NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payout methods
CREATE TABLE public.payout_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    method_type TEXT NOT NULL CHECK (method_type IN ('bank_account', 'paypal', 'stripe')),
    account_details JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts
CREATE TABLE public.payouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    artist_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    payout_method_id UUID REFERENCES public.payout_methods(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    reference_id TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_albums_artist_id ON public.albums(artist_id);
CREATE INDEX idx_albums_genre ON public.albums(genre);
CREATE INDEX idx_albums_release_year ON public.albums(release_year);
CREATE INDEX idx_tracks_album_id ON public.tracks(album_id);
CREATE INDEX idx_user_interactions_user_id ON public.user_interactions(user_id);
CREATE INDEX idx_user_interactions_target ON public.user_interactions(target_type, target_id);
CREATE INDEX idx_album_purchases_user_id ON public.album_purchases(user_id);
CREATE INDEX idx_album_purchases_album_id ON public.album_purchases(album_id);
CREATE INDEX idx_events_artist_id ON public.events(artist_id);
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all public user profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Albums policies
CREATE POLICY "Anyone can view public albums" ON public.albums
    FOR SELECT USING (is_public = true OR auth.uid() = artist_id);

CREATE POLICY "Artists can manage their own albums" ON public.albums
    FOR ALL USING (auth.uid() = artist_id);

-- Tracks policies
CREATE POLICY "Anyone can view tracks from public albums" ON public.tracks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.albums 
            WHERE albums.id = tracks.album_id 
            AND (albums.is_public = true OR albums.artist_id = auth.uid())
        )
    );

CREATE POLICY "Artists can manage tracks from their albums" ON public.tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.albums 
            WHERE albums.id = tracks.album_id 
            AND albums.artist_id = auth.uid()
        )
    );

-- User interactions policies
CREATE POLICY "Users can view all interactions" ON public.user_interactions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own interactions" ON public.user_interactions
    FOR ALL USING (auth.uid() = user_id);

-- Album purchases policies
CREATE POLICY "Users can view their own purchases" ON public.album_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" ON public.album_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Anyone can view active events" ON public.events
    FOR SELECT USING (is_active = true);

CREATE POLICY "Artists can manage their own events" ON public.events
    FOR ALL USING (auth.uid() = artist_id);

-- Artist verifications policies
CREATE POLICY "Users can view their own verification" ON public.artist_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own verification" ON public.artist_verifications
    FOR ALL USING (auth.uid() = user_id);

-- Artist earnings policies
CREATE POLICY "Artists can view their own earnings" ON public.artist_earnings
    FOR SELECT USING (auth.uid() = artist_id);

-- Payout methods policies
CREATE POLICY "Users can manage their own payout methods" ON public.payout_methods
    FOR ALL USING (auth.uid() = user_id);

-- Payouts policies
CREATE POLICY "Artists can view their own payouts" ON public.payouts
    FOR SELECT USING (auth.uid() = artist_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON public.albums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON public.tracks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_methods_updated_at BEFORE UPDATE ON public.payout_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update album duration when tracks are modified
CREATE OR REPLACE FUNCTION update_album_duration()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.albums 
    SET total_duration = (
        SELECT COALESCE(SUM(duration), 0) 
        FROM public.tracks 
        WHERE album_id = COALESCE(NEW.album_id, OLD.album_id)
    )
    WHERE id = COALESCE(NEW.album_id, OLD.album_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_album_duration_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.tracks
    FOR EACH ROW EXECUTE FUNCTION update_album_duration();

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.target_type = 'album' THEN
            UPDATE public.albums 
            SET likes_count = likes_count + 1 
            WHERE id = NEW.target_id;
        ELSIF NEW.target_type = 'track' THEN
            UPDATE public.tracks 
            SET likes_count = likes_count + 1 
            WHERE id = NEW.target_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.target_type = 'album' THEN
            UPDATE public.albums 
            SET likes_count = likes_count - 1 
            WHERE id = OLD.target_id;
        ELSIF OLD.target_type = 'track' THEN
            UPDATE public.tracks 
            SET likes_count = likes_count - 1 
            WHERE id = OLD.target_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_likes_count_insert_trigger
    AFTER INSERT ON public.user_interactions
    FOR EACH ROW 
    WHEN (NEW.interaction_type = 'like')
    EXECUTE FUNCTION update_likes_count();

CREATE TRIGGER update_likes_count_delete_trigger
    AFTER DELETE ON public.user_interactions
    FOR EACH ROW 
    WHEN (OLD.interaction_type = 'like')
    EXECUTE FUNCTION update_likes_count(); 