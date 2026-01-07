import { LoginForm } from './components/LoginForm';

/**
 * Login page
 * 
 * Server component that handles search params and renders the login form.
 * Properly awaits searchParams Promise for Next.js 15+ compatibility.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md">
        <LoginForm
          redirectTo={params.redirectTo}
          initialMessage={params.message}
        />

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
          By continuing, you agree to TeamCore&apos;s Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
