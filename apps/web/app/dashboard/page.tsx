import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Dashboard page - Main authenticated area
 * 
 * This is a server component that verifies authentication
 * and displays the user's dashboard.
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated (should be caught by middleware)
  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Welcome back, {user.email}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard Cards */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold mb-2">Players</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Manage your team's player roster and statistics
          </p>
          <a
            href="/players"
            className="inline-flex items-center text-sm font-medium text-black dark:text-white hover:underline"
          >
            View Players →
          </a>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold mb-2">Teams</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Organize and manage your sports teams
          </p>
          <a
            href="/teams"
            className="inline-flex items-center text-sm font-medium text-black dark:text-white hover:underline"
          >
            View Teams →
          </a>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
            Configure your account and preferences
          </p>
          <a
            href="/settings"
            className="inline-flex items-center text-sm font-medium text-black dark:text-white hover:underline"
          >
            Manage Settings →
          </a>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Your team statistics and insights will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
