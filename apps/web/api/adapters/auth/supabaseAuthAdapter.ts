import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { VercelRequest } from '@vercel/node';

/**
 * Result of authentication verification
 */
export interface AuthResult {
  authenticated: boolean;
  user?: User;
  error?: string;
}

/**
 * Supabase auth adapter for serverless functions
 * 
 * Provides authentication verification for Vercel serverless functions
 * by validating JWT tokens from request headers.
 */
export class SupabaseAuthAdapter {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Verify authentication from request headers
   * 
   * Extracts the JWT token from the Authorization header and verifies it
   * against Supabase authentication.
   * 
   * @param req - Vercel request object
   * @returns AuthResult with user data if authenticated
   */
  async verifyAuth(req: VercelRequest): Promise<AuthResult> {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid Authorization header',
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify the JWT token
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser(token);

      if (error || !user) {
        return {
          authenticated: false,
          error: error?.message || 'Invalid token',
        };
      }

      return {
        authenticated: true,
        user,
      };
    } catch (error) {
      return {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  /**
   * Middleware function to protect serverless functions
   * 
   * Use this as a wrapper to ensure only authenticated requests
   * can access your serverless function.
   * 
   * @param req - Vercel request object
   * @returns AuthResult or throws error if not authenticated
   */
  async requireAuth(req: VercelRequest): Promise<User> {
    const authResult = await this.verifyAuth(req);

    if (!authResult.authenticated || !authResult.user) {
      throw new Error(authResult.error || 'Authentication required');
    }

    return authResult.user;
  }
}

/**
 * Factory function to create a Supabase auth adapter
 * 
 * @param supabaseUrl - Supabase project URL
 * @param supabaseAnonKey - Supabase anon key (for JWT verification)
 * @returns SupabaseAuthAdapter instance
 */
export function createSupabaseAuthAdapter(
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseAuthAdapter {
  return new SupabaseAuthAdapter(supabaseUrl, supabaseAnonKey);
}
