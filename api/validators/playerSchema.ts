import { z } from 'zod';

/**
 * Validation schema for player image from FUPA API
 * 
 * @property path - URL path to the player's image
 * @property description - Alt text description of the image
 * @property source - Source/credit for the image (e.g., photographer name)
 * @property svg - Whether the image is in SVG format (false for raster formats)
 */
export const playerImageSchema = z.object({
  path: z.string(),
  description: z.string(),
  source: z.string(),
  svg: z.boolean(),
});

/**
 * Validation schema for a single player from FUPA API
 */
export const playerSchema = z.object({
  id: z.number(),
  slug: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isDeactivated: z.boolean(),
  position: z.string(),
  image: playerImageSchema.nullable(),
  jerseyNumber: z.number(),
  matches: z.number(),
  goals: z.number(),
  flags: z.array(z.string()),
  age: z.number(),
});

/**
 * Validation schema for FUPA squad API response
 */
export const fupaSquadResponseSchema = z.object({
  players: z.array(playerSchema),
});

export type ValidatedPlayer = z.infer<typeof playerSchema>;
export type ValidatedFupaSquadResponse = z.infer<typeof fupaSquadResponseSchema>;
