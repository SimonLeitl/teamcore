/**
 * Type definitions for player data
 */

/**
 * Player data structure from FUPA API
 */
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: string;
  nationality?: string;
}

/**
 * Database player record structure
 */
export interface PlayerRecord {
  id: string;
  first_name: string;
  last_name: string;
  jersey_number?: number;
  position?: string;
  date_of_birth?: string;
  nationality?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * API Response from FUPA squad endpoint
 */
export interface FupaSquadResponse {
  players: Player[];
}
