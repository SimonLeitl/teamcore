-- Initial schema for TeamCore database
-- Creates the players table with all required fields and indexes

-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_deactivated BOOLEAN NOT NULL DEFAULT false,
  position TEXT NOT NULL,
  image_path TEXT,
  jersey_number INTEGER NOT NULL,
  matches INTEGER NOT NULL DEFAULT 0,
  goals INTEGER NOT NULL DEFAULT 0,
  age INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_players_last_name ON public.players(last_name);
CREATE INDEX IF NOT EXISTS idx_players_position ON public.players(position);
CREATE INDEX IF NOT EXISTS idx_players_is_deactivated ON public.players(is_deactivated);
CREATE INDEX IF NOT EXISTS idx_players_jersey_number ON public.players(jersey_number);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_players_updated_at ON public.players;
CREATE TRIGGER update_players_updated_at 
  BEFORE UPDATE ON public.players 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.players IS 'Stores player information including statistics and personal details';
COMMENT ON COLUMN public.players.id IS 'Unique identifier for the player (from external API)';
COMMENT ON COLUMN public.players.slug IS 'URL-friendly identifier for the player';
COMMENT ON COLUMN public.players.first_name IS 'Player first name';
COMMENT ON COLUMN public.players.last_name IS 'Player last name';
COMMENT ON COLUMN public.players.is_deactivated IS 'Whether the player is currently deactivated';
COMMENT ON COLUMN public.players.position IS 'Player position on the field';
COMMENT ON COLUMN public.players.image_path IS 'URL or path to player profile image';
COMMENT ON COLUMN public.players.jersey_number IS 'Player jersey/shirt number';
COMMENT ON COLUMN public.players.matches IS 'Total number of matches played';
COMMENT ON COLUMN public.players.goals IS 'Total number of goals scored';
COMMENT ON COLUMN public.players.age IS 'Player age in years';
COMMENT ON COLUMN public.players.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.players.updated_at IS 'Timestamp when the record was last updated';
