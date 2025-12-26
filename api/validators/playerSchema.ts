import { z } from 'zod';

/**
 * Validation schema for a single player from FUPA API
 */
export const playerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  jerseyNumber: z.number().optional(),
  position: z.string().optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
});

/**
 * Validation schema for FUPA squad API response
 */
export const fupaSquadResponseSchema = z.object({
  players: z.array(playerSchema),
});

export type ValidatedPlayer = z.infer<typeof playerSchema>;
export type ValidatedFupaSquadResponse = z.infer<typeof fupaSquadResponseSchema>;
