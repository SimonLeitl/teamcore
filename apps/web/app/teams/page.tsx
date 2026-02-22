import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Teams page - Coming Soon
 *
 * This page informs users that team features are coming soon.
 */
export default async function TeamsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Organize and manage your sports teams
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-700 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-zinc-500 dark:text-zinc-400"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          Team management features are currently under development. Stay tuned
          — exciting new functionality will be available here soon!
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
