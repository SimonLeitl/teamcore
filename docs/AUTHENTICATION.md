# Supabase Authentication Setup Guide

This guide explains how to set up and use Supabase authentication in the TeamCore application.

## Overview

TeamCore uses Supabase authentication to secure access to the main application. The implementation includes:
- Email/password authentication
- Protected routes using Next.js middleware
- JWT-based API authentication for serverless functions
- Server and client components with proper session handling

## Environment Variables

Before starting, you need to configure the following environment variables. Copy `.env.local.example` to `.env.local`:

```bash
cd apps/web
cp .env.local.example .env.local
```

Then update the values:

```bash
# Required for authentication and client-side operations
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Required for server-side operations (API functions)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-service-role-key-here
```

### Getting Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com/project/_/settings/api
2. Copy the **Project URL** → use for both `*_SUPABASE_URL` variables
3. Copy the **anon public** key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy the **service_role** key → use for `SUPABASE_KEY`

⚠️ **Security Note**: The service_role key has admin privileges. Keep it secret and only use it server-side.

## Architecture

### Client-Side Authentication

The app uses three Supabase client configurations:

1. **Browser Client** (`lib/supabase/client.ts`)
   - Used in Client Components
   - Handles cookies automatically
   - Example: Login form, user menu

2. **Server Client** (`lib/supabase/server.ts`)
   - Used in Server Components, Server Actions, and Route Handlers
   - Manages cookies for server-side rendering
   - Example: Dashboard page, auth actions

3. **Middleware Client** (`lib/supabase/middleware.ts`)
   - Used in Next.js middleware
   - Refreshes sessions on every request
   - Protects routes from unauthorized access

### Protected Routes

The middleware automatically protects these routes:
- `/dashboard` - Main authenticated area
- `/players` - Player management
- `/teams` - Team management

Unauthenticated users attempting to access these routes will be redirected to `/auth/login`.

### API Authentication

Serverless functions require a valid JWT token in the Authorization header:

```bash
curl -X POST https://your-app.vercel.app/api/fetchPlayers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

The token is automatically included when making requests from authenticated client components using the Supabase client.

## Usage

### Login Flow

1. User visits the app and is redirected to `/auth/login` if accessing protected routes
2. User enters email and password
3. On successful login, redirected to `/dashboard` (or the original requested page)
4. Session is stored in HTTP-only cookies for security

### Logout Flow

1. User clicks "Sign out" button in the header
2. `logout()` server action is called
3. Session is cleared from Supabase and cookies
4. User is redirected to `/auth/login`

### Creating New Users

Users can sign up from the login page by clicking "Don't have an account? Sign up". This calls the `signup()` server action.

**Note**: Depending on your Supabase project settings, email confirmation may be required before the user can log in.

## Code Examples

### Accessing User Data in Server Components

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <div>Welcome, {user?.email}!</div>;
}
```

### Accessing User Data in Client Components

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const supabase = createClient();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);
  
  return <div>Email: {user?.email}</div>;
}
```

### Protecting API Functions

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createSupabaseAuthAdapter } from './adapters/auth/supabaseAuthAdapter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify authentication
  try {
    const authAdapter = createSupabaseAuthAdapter(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const user = await authAdapter.requireAuth(req);
    
    // User is authenticated, proceed with function logic
    res.json({ message: 'Success', userId: user.id });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

## Customization

### Adding OAuth Providers

To add OAuth providers (Google, GitHub, etc.):

1. Enable the provider in your Supabase dashboard:
   - Go to **Authentication → Providers**
   - Enable and configure the desired provider

2. Add a sign-in button to `apps/web/app/auth/login/page.tsx`:

```typescript
const handleOAuthLogin = async (provider: 'google' | 'github') => {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
```

### Customizing Protected Routes

Edit `apps/web/lib/supabase/middleware.ts` to change which routes are protected:

```typescript
const protectedPaths = ['/dashboard', '/players', '/teams', '/admin'];
```

### Email Templates

Customize authentication emails in your Supabase dashboard:
- Go to **Authentication → Email Templates**
- Modify templates for:
  - Confirmation emails
  - Password reset emails
  - Magic link emails

## Troubleshooting

### "Invalid token" errors

- Ensure environment variables are set correctly
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are available in the browser
- Verify the token hasn't expired (default expiry is 1 hour)

### Redirects not working

- Check that middleware is running (should see logs in Vercel)
- Verify `middleware.ts` matcher configuration
- Ensure cookies are enabled in the browser

### API authentication failing

- Confirm you're sending the Authorization header with "Bearer " prefix
- Use the user's JWT token, not the anon or service_role key
- Get the token from `supabase.auth.getSession()` in client code

## Security Best Practices

1. **Never expose service_role key**: Only use it in server-side code
2. **Use HTTPS**: Ensure your app is served over HTTPS in production
3. **Validate user input**: Always validate and sanitize user input
4. **Set up Row Level Security (RLS)**: Protect your database tables with RLS policies
5. **Implement rate limiting**: Add rate limiting to prevent abuse
6. **Regular security audits**: Keep dependencies updated and run security scans

## Testing

To test authentication locally:

1. Set up local Supabase (optional):
```bash
npx supabase start
```

2. Update `.env.local` with local credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-supabase-start>
```

3. Start the dev server:
```bash
npm run dev
```

4. Visit http://localhost:3000 and test:
   - Sign up with a new account
   - Log in with existing credentials
   - Access protected routes
   - Test logout functionality

## Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard:
   - Go to **Project Settings → Environment Variables**
   - Add all variables from `.env.local`
   - Set them for Production, Preview, and Development environments

2. Ensure the Supabase callback URL is configured:
   - In Supabase dashboard, go to **Authentication → URL Configuration**
   - Add your Vercel URL to **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

3. Deploy:
```bash
git push origin main
```

## Support

For issues or questions:
- Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
- Review [Next.js middleware docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- Open an issue in the TeamCore repository
