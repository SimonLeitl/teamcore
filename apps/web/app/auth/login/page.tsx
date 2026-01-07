'use client';

import { useState } from 'react';
import { login, signup } from '../actions';

/**
 * Login page component
 * 
 * Provides a form for users to log in or sign up using email and password.
 * Includes client-side state management for error handling and form submission.
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; message?: string };
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.message || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // Add redirect URL to form data
    if (searchParams.redirectTo) {
      formData.append('redirectTo', searchParams.redirectTo);
    }

    try {
      const result = isSignUp ? await signup(formData) : await login(formData);
      
      if (result && 'error' in result) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-black dark:bg-white mb-4">
              <span className="text-white dark:text-black font-bold text-xl">TC</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {isSignUp
                ? 'Sign up to get started with TeamCore'
                : 'Sign in to your TeamCore account'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Login/Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700"
                placeholder="••••••••"
                disabled={isLoading}
                minLength={6}
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Please wait...'
                : isSignUp
                ? 'Sign up'
                : 'Sign in'}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              disabled={isLoading}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-zinc-600 dark:text-zinc-400">
          By continuing, you agree to TeamCore's Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
