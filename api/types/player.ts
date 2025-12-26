/**
 * Type definitions for player data
 */

/**
 * Player image structure from FUPA API
 */
export interface PlayerImage {
  path: string;
  description: string;
  source: string;
  svg: boolean;
}

/**
 * Player data structure from FUPA API
 */
export interface Player {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  isDeactivated: boolean;
  position: string;
  image: PlayerImage | null;
  jerseyNumber: number;
  matches: number;
  goals: number;
  flags: string[];
  age: number;
}

/**
 * Database player record structure
 */
export interface PlayerRecord {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  is_deactivated: boolean;
  position: string;
  image_path?: string;
  jersey_number: number;
  matches: number;
  goals: number;
  age: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * API Response from FUPA squad endpoint
 */
export interface FupaSquadResponse {
  players: Player[];
}
