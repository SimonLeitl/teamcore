-- Allow NULL values for jersey_number column
-- Some players may not have an assigned jersey number

ALTER TABLE public.players 
  ALTER COLUMN jersey_number DROP NOT NULL;

-- Update comment to reflect the change
COMMENT ON COLUMN public.players.jersey_number IS 'Player jersey/shirt number (nullable - some players may not have an assigned number)';
