# Setup Guide: Database Migrations

This guide walks you through setting up database migrations for TeamCore after merging this PR.

## Prerequisites

- Access to your Supabase project dashboard
- Admin access to GitHub repository settings
- Node.js 22.x installed locally

## Step 1: Configure GitHub Secrets

Add these secrets to your GitHub repository for automated migrations:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret** and add:

### Required Secrets

#### `SUPABASE_ACCESS_TOKEN`
Your Supabase personal access token.

**How to get it:**
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Give it a descriptive name (e.g., "TeamCore CI/CD")
4. Copy the token and save it as a GitHub secret

#### `SUPABASE_DB_PASSWORD`
Your database password.

**How to get it:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings → Database**
3. Find the "Database Password" section
4. Copy your password (or reset it if needed)
5. Save it as a GitHub secret

#### `SUPABASE_PROJECT_REF`
Your Supabase project reference ID.

**How to get it:**
1. Look at your Supabase project URL: `https://[PROJECT_REF].supabase.co`
2. The PROJECT_REF is the subdomain (before `.supabase.co`)
3. Or find it in **Settings → General → Reference ID**
4. Save it as a GitHub secret

## Step 2: Link Local Development Environment

For local development, you need to link your project to Supabase:

```bash
# Install dependencies (includes Supabase CLI)
npm install

# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF
```

When prompted, enter your database password.

## Step 3: Set Local Environment Variables

Create a `.env.local` file (already in .gitignore):

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```bash
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_KEY=your-service-role-key-here
```

**How to get your service role key:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Find the "service_role" key under "Project API keys"
4. Copy and paste it into `.env.local`

⚠️ **Never commit `.env.local` to version control!**

## Step 4: Apply Initial Migration

### Option A: Automatic (Recommended for Production)

Merge this PR to the `main` branch. The GitHub Actions workflow will automatically:
1. Detect migration files
2. Link to your Supabase project
3. Apply pending migrations
4. Report success/failure

### Option B: Manual (for Testing)

Apply migrations manually:

```bash
# Check current migration status
npm run db:status

# Apply all pending migrations
npm run db:migrate
```

## Step 5: Verify Migration

Check that the migration was applied successfully:

```bash
# Via CLI
npm run db:status

# Via Supabase Dashboard
# Go to Database → Tables and verify the "players" table exists
```

## Step 6: Test Local Development

Start a local Supabase instance for development:

```bash
# Start local Supabase (PostgreSQL, Auth, Storage, Studio)
npx supabase start

# This will output URLs for:
# - API: http://localhost:54321
# - Studio: http://localhost:54323
# - Database: postgresql://postgres:postgres@localhost:54322/postgres
```

Access Supabase Studio at http://localhost:54323 to inspect your local database.

## Step 7: Create Your First Migration (Optional)

Test the migration system by creating a sample migration:

```bash
# Create a new migration
npm run migrate:create add_test_column

# Edit the generated file in supabase/migrations/
# Add some SQL (e.g., ALTER TABLE players ADD COLUMN test TEXT;)

# Apply to local database
npx supabase db reset

# If it works, commit and push to trigger production migration
```

## Troubleshooting

### "Supabase CLI not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Failed to connect to database"
- Verify your `SUPABASE_DB_PASSWORD` is correct
- Check that your IP is not blocked in Supabase network restrictions
- Ensure your project is not paused (free tier limitation)

### "Migration already applied"
This is normal if running `db:migrate` multiple times. Supabase tracks which migrations have been applied.

### GitHub Actions workflow fails
1. Check that all three secrets are set correctly
2. Verify secret names match exactly (case-sensitive)
3. Review the workflow logs in GitHub Actions tab

## Next Steps

1. **Read the full documentation**: See [MIGRATIONS.md](./MIGRATIONS.md)
2. **Bookmark the quick reference**: [MIGRATION_QUICK_REF.md](./MIGRATION_QUICK_REF.md)
3. **Set up staging environment**: Repeat this process for a staging Supabase project
4. **Create team documentation**: Add team-specific migration policies

## Support

If you encounter issues:
- 📖 Check [MIGRATIONS.md](./MIGRATIONS.md) for detailed troubleshooting
- 💬 Ask in Supabase Discord: https://discord.supabase.com/
- 🐛 Open an issue: https://github.com/SimonLeitl/teamcore/issues

## Summary Checklist

- [ ] Added three GitHub secrets (ACCESS_TOKEN, DB_PASSWORD, PROJECT_REF)
- [ ] Linked local project with `npx supabase link`
- [ ] Created `.env.local` with credentials
- [ ] Applied initial migration (automatically or manually)
- [ ] Verified migration in Supabase dashboard
- [ ] Tested local Supabase environment
- [ ] Read MIGRATIONS.md documentation

Once all steps are complete, you're ready to use database migrations! 🎉
