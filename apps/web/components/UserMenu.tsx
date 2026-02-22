'use client';

import { logout } from '@/app/auth/actions';
import { useState } from 'react';

interface UserMenuProps {
  email: string;
}

/**
 * User menu component
 * 
 * Displays the user's email and provides a logout button.
 * This is a client component to handle interactive logout.
 */
export function UserMenu({ email }: UserMenuProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-600 dark:text-zinc-400 hidden sm:inline">
        {email}
      </span>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="inline-flex h-9 items-center rounded-md bg-black px-3 text-xs font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  );
}
