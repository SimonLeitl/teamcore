import { VercelRequest, VercelResponse } from '@vercel/node';
import { createSupabasePlayerAdapter } from './adapters/supabaseAdapter';
import { createSupabaseAuthAdapter } from './adapters/auth/supabaseAuthAdapter';
import { createPlayerService } from './services/playerService';

/**
 * Serverless function to fetch all players from FUPA API and store in Supabase
 * 
 * **Authentication Required**: This endpoint requires a valid JWT token in the Authorization header.
 * 
 * Required environment variables:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_KEY: Supabase API key (service role key recommended)
 * - NEXT_PUBLIC_SUPABASE_URL: Public Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Public Supabase anon key (for auth verification)
 * - FUPA_API_URL: FUPA API endpoint URL (optional, defaults to TUS Ellmendingen squad)
 * 
 * @param req - Vercel request object
 * @param res - Vercel response object
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({
      error: 'Method Not Allowed',
      message: 'This endpoint only accepts POST requests',
    });
    return;
  }

  // Validate required environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({
      error: 'Configuration Error',
      message: 'Missing required environment variables: SUPABASE_URL and/or SUPABASE_KEY',
    });
    return;
  }

  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    res.status(500).json({
      error: 'Configuration Error',
      message: 'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    });
    return;
  }

  // Verify authentication
  try {
    const authAdapter = createSupabaseAuthAdapter(publicSupabaseUrl, publicSupabaseAnonKey);
    await authAdapter.requireAuth(req);
  } catch (error) {
    // Log the specific error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    console.error(JSON.stringify({
      level: 'error',
      service: 'fetchPlayers',
      context: 'authentication',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }));

    // Return a generic error message for security
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. Please log in and try again.',
    });
    return;
  }

  // Use default FUPA API URL or allow override via environment variable
  const fupaApiUrl = process.env.FUPA_API_URL || 
    'https://api.fupa.net/v1/teams/tus-ellmendingen-m1-2025-26/squad';

  try {
    // Create adapter and service instances
    const supabaseAdapter = createSupabasePlayerAdapter(supabaseUrl, supabaseKey);
    const playerService = createPlayerService(supabaseAdapter, fupaApiUrl);

    // Fetch and store players
    const result = await playerService.fetchAndStoreAllPlayers();

    if (result.success) {
      res.status(200).json({
        message: 'Players fetched and stored successfully',
        playersProcessed: result.playersProcessed,
        timestamp: new Date().toISOString(),
        warnings: result.errors.length > 0 ? result.errors : undefined,
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch and store players',
        message: result.errors.join('; '),
        playersProcessed: result.playersProcessed,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Structured logging for Vercel
    console.error(JSON.stringify({
      level: 'error',
      service: 'fetchPlayers',
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    }));

    res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
