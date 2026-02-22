import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Settings page - Coming Soon
 *
 * This is a server component that verifies authentication
 * and displays a "Coming Soon" notice for the settings area.
 */
export default async function SettingsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black dark:bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white dark:text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Coming Soon</h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          We&apos;re working on new settings and features. Stay tuned — this area will be available soon.
        </p>
      </div>
    </div>
  );
}
