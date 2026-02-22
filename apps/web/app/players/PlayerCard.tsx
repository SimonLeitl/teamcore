'use client';

import { useState } from 'react';

interface PlayerCardProps {
  firstName: string;
  lastName: string;
  imagePath?: string;
}

/**
 * PlayerCard - Client component for displaying a single player card
 * 
 * Features:
 * - Displays player's full name
 * - Shows player image with fallback to white frame on error
 * - Responsive design with Tailwind CSS
 */
export default function PlayerCard({ firstName, lastName, imagePath }: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        {/* Player Image */}
        <div className="flex-shrink-0">
          {imagePath && !imageError ? (
            <img
              src={imagePath}
              alt={`${firstName} ${lastName}`}
              className="w-20 h-20 object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-20 h-20 bg-white dark:bg-zinc-700 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg" />
          )}
        </div>

        {/* Player Name */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">
            {firstName} {lastName}
          </h3>
        </div>
      </div>
    </div>
  );
}
