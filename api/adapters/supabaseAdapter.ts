import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlayerRecord } from '../types/player';

/**
 * Supabase adapter for player operations
 * 
 * Provides a typed interface to interact with the players table in Supabase.
 */
export class SupabasePlayerAdapter {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Upsert players into the database
   * Inserts new players or updates existing ones based on the player ID
   * 
   * @param players - Array of player records to upsert
   * @returns Promise with upserted player records
   */
  async upsertPlayers(players: PlayerRecord[]): Promise<PlayerRecord[]> {
    const { data, error } = await this.client
      .from('players')
      .upsert(players, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      throw new Error(`Failed to upsert players: ${error.message}`);
    }

    return data as PlayerRecord[];
  }

  /**
   * Fetch all players from the database
   * 
   * @returns Promise with all player records
   */
  async getAllPlayers(): Promise<PlayerRecord[]> {
    const { data, error } = await this.client
      .from('players')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch players: ${error.message}`);
    }

    return data as PlayerRecord[];
  }
}

/**
 * Factory function to create a Supabase player adapter
 * 
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase API key
 * @returns SupabasePlayerAdapter instance
 */
export function createSupabasePlayerAdapter(
  supabaseUrl: string,
  supabaseKey: string
): SupabasePlayerAdapter {
  return new SupabasePlayerAdapter(supabaseUrl, supabaseKey);
}
