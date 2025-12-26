/**
 * Type definitions for player data
 */

/**
 * Player image structure from FUPA API
 */
export interface PlayerImage {
  /** URL path to the player's image */
  path: string;
  /** Alt text description of the image */
  description: string;
  /** Source/credit for the image (e.g., photographer name) */
  source: string;
  /** Whether the image is in SVG format (false for raster formats like JPG/PNG) */
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
