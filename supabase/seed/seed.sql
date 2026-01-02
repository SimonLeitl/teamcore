-- Seed data for local development and testing
-- This file populates the database with sample data

-- Clear existing data (for re-running seed)
TRUNCATE public.players CASCADE;

-- Insert sample players
INSERT INTO public.players (
  id,
  slug,
  first_name,
  last_name,
  is_deactivated,
  position,
  image_path,
  jersey_number,
  matches,
  goals,
  age
) VALUES
  ('player-001', 'max-mueller', 'Max', 'Müller', false, 'Goalkeeper', null, 1, 15, 0, 25),
  ('player-002', 'tom-schneider', 'Tom', 'Schneider', false, 'Defender', null, 4, 18, 2, 24),
  ('player-003', 'lukas-wagner', 'Lukas', 'Wagner', false, 'Defender', null, 5, 16, 1, 26),
  ('player-004', 'felix-fischer', 'Felix', 'Fischer', false, 'Midfielder', null, 8, 20, 5, 23),
  ('player-005', 'leon-becker', 'Leon', 'Becker', false, 'Midfielder', null, 10, 19, 8, 22),
  ('player-006', 'jonas-weber', 'Jonas', 'Weber', false, 'Forward', null, 9, 17, 12, 21),
  ('player-007', 'paul-schroeder', 'Paul', 'Schröder', false, 'Forward', null, 11, 18, 10, 24),
  ('player-008', 'david-hoffmann', 'David', 'Hoffmann', true, 'Midfielder', null, 7, 5, 1, 27)
ON CONFLICT (id) DO NOTHING;

-- Verify the seed data
SELECT 
  COUNT(*) as total_players,
  COUNT(*) FILTER (WHERE is_deactivated = false) as active_players,
  COUNT(*) FILTER (WHERE is_deactivated = true) as inactive_players
FROM public.players;

-- Display seeded players
SELECT 
  id,
  first_name,
  last_name,
  position,
  jersey_number,
  is_deactivated
FROM public.players
ORDER BY jersey_number;
