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
/** Returns true only for safe http/https URLs */
function isSafeUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export default function PlayerCard({ firstName, lastName, imagePath }: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);

  const safeImageSrc = imagePath && isSafeUrl(imagePath) ? `${imagePath}1920xauto.webp` : undefined;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        {/* Player Image */}
        <div className="flex-shrink-0">
          {safeImageSrc && !imageError ? (
            <img
              src={safeImageSrc}
              alt={`${firstName} ${lastName}`}
              width={80}
              height={80}
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
