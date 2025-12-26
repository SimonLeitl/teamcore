import { Player, PlayerRecord } from '../types/player';
import { fupaSquadResponseSchema } from '../validators/playerSchema';
import { SupabasePlayerAdapter } from '../adapters/supabaseAdapter';

/**
 * Service for fetching and storing player data
 */
export class PlayerService {
  private supabaseAdapter: SupabasePlayerAdapter;
  private fupaApiUrl: string;

  constructor(supabaseAdapter: SupabasePlayerAdapter, fupaApiUrl: string) {
    this.supabaseAdapter = supabaseAdapter;
    this.fupaApiUrl = fupaApiUrl;
  }

  /**
   * Fetch players from FUPA API
   * 
   * @returns Promise with array of players
   * @throws Error if fetch fails or validation fails
   */
  private async fetchPlayersFromApi(): Promise<Player[]> {
    const response = await fetch(this.fupaApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TeamCore/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch players from FUPA API: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Validate response structure
    const validatedData = fupaSquadResponseSchema.parse(data);
    
    return validatedData.players;
  }

  /**
   * Transform API player data to database record format
   * 
   * @param player - Player data from API
   * @returns PlayerRecord for database insertion
   */
  private transformPlayerToRecord(player: Player): PlayerRecord {
    return {
      id: player.id,
      first_name: player.firstName,
      last_name: player.lastName,
      jersey_number: player.jerseyNumber,
      position: player.position,
      date_of_birth: player.dateOfBirth,
      nationality: player.nationality,
    };
  }

  /**
   * Fetch all players from API and store them in Supabase
   * 
   * @returns Promise with result containing player count and any errors
   */
  async fetchAndStoreAllPlayers(): Promise<{
    success: boolean;
    playersProcessed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let playersProcessed = 0;

    try {
      // Fetch players from API
      const players = await this.fetchPlayersFromApi();

      if (players.length === 0) {
        return {
          success: true,
          playersProcessed: 0,
          errors: [],
        };
      }

      // Transform to database records
      const playerRecords = players.map(player => 
        this.transformPlayerToRecord(player)
      );

      // Upsert to database
      const upsertedPlayers = await this.supabaseAdapter.upsertPlayers(playerRecords);
      playersProcessed = upsertedPlayers.length;

      return {
        success: true,
        playersProcessed,
        errors,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);

      return {
        success: false,
        playersProcessed,
        errors,
      };
    }
  }
}

/**
 * Factory function to create a player service
 * 
 * @param supabaseAdapter - Supabase adapter for database operations
 * @param fupaApiUrl - FUPA API URL to fetch players from
 * @returns PlayerService instance
 */
export function createPlayerService(
  supabaseAdapter: SupabasePlayerAdapter,
  fupaApiUrl: string
): PlayerService {
  return new PlayerService(supabaseAdapter, fupaApiUrl);
}
