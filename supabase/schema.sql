-- ==========================================================
-- Wordle Unlimited - Supabase Database Schema
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==========================================================

-- 1. Create Profiles Table (Stores Level Journey & Player Rank)
CREATE TABLE IF NOT EXISTS public.wordle_profiles (
    id TEXT PRIMARY KEY, -- Player Device / User UUID
    player_name TEXT DEFAULT 'Wordle Master',
    current_level INT DEFAULT 1,
    max_unlocked_level INT DEFAULT 1,
    stars JSONB DEFAULT '{}'::jsonb,
    total_xp INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Statistics Table (Overall & Per-Length Stats)
CREATE TABLE IF NOT EXISTS public.wordle_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES public.wordle_profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'all', '4', '5', '6', '7', '8'
    played INT DEFAULT 0,
    wins INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0,
    distribution JSONB DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_player_category UNIQUE (player_id, category)
);

-- 3. Create History Log Table (Archive of played games)
CREATE TABLE IF NOT EXISTS public.wordle_history (
    id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES public.wordle_profiles(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    length INT NOT NULL,
    mode TEXT NOT NULL,
    won BOOLEAN NOT NULL,
    guesses_count INT NOT NULL,
    duration_seconds INT DEFAULT 0,
    level INT,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_wordle_stats_player ON public.wordle_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_wordle_history_player ON public.wordle_history(player_id);
CREATE INDEX IF NOT EXISTS idx_wordle_history_played_at ON public.wordle_history(played_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wordle_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wordle_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wordle_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated access for player_id
DROP POLICY IF EXISTS "Allow public read-write for profiles" ON public.wordle_profiles;
CREATE POLICY "Allow public read-write for profiles"
    ON public.wordle_profiles FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for stats" ON public.wordle_stats;
CREATE POLICY "Allow public read-write for stats"
    ON public.wordle_stats FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read-write for history" ON public.wordle_history;
CREATE POLICY "Allow public read-write for history"
    ON public.wordle_history FOR ALL
    USING (true)
    WITH CHECK (true);
