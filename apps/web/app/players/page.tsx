import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PlayerCard from './PlayerCard';
import { PlayerRecord } from '@/api/types/player';

/**
 * Players page - Displays list of all players
 * 
 * This is a server component that verifies authentication
 * and fetches all players from Supabase.
 */
export default async function PlayersPage() {
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Fetch all players
  const { data: players, error: fetchError } = await supabase
    .from('players')
    .select('*')
    .order('last_name', { ascending: true });

  // Handle fetch errors
  if (fetchError) {
    return (
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading players: {fetchError.message}
          </p>
        </div>
      </div>
    );
  }

  // Type assertion - Supabase returns empty array for no results, null only on error (handled above)
  const playerRecords = players as PlayerRecord[];

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Manage your team&apos;s player roster
        </p>
      </div>

      {/* Players Grid */}
      {playerRecords.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">No players found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {playerRecords.map((player) => (
            <PlayerCard
              key={player.id}
              firstName={player.first_name}
              lastName={player.last_name}
              imagePath={player.image_path}
            />
          ))}
        </div>
      )}
    </div>
  );
}
