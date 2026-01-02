# Database Migrations

This document provides comprehensive guidance on managing database schema changes using Supabase migrations.

## Overview

TeamCore uses **Supabase CLI** for database migration management. Supabase CLI provides native PostgreSQL migration support with version control, making it easy to track and apply schema changes across development, staging, and production environments.

## Prerequisites

- Node.js 22.x or later
- npm installed
- Supabase CLI (installed automatically via `npm install`)
- Access to your Supabase project (URL and service role key)

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install the Supabase CLI as a dev dependency.

### 2. Configure Environment Variables

Ensure you have the following environment variables set:

**For local development** (`.env.local`):
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

**For production** (Vercel Environment Variables):
Set these in your Vercel project settings under Environment Variables.

### 3. Link to Your Supabase Project (Optional for Local Dev)

If you want to test migrations against a local Supabase instance:

```bash
npx supabase init
npx supabase start
```

This will start a local Supabase instance with PostgreSQL, Auth, Storage, and Studio.

## Migration Workflow

### Creating a New Migration

#### Option 1: Manual Migration File

Create a new migration file in `supabase/migrations/` with a timestamp prefix:

```bash
# Format: YYYYMMDDHHMMSS_description.sql
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_add_teams_table.sql
```

Then write your SQL migration:

```sql
-- Add teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teams_name ON public.teams(name);
```

#### Option 2: Auto-generate from Schema Diff (Recommended)

If you've made changes directly in the Supabase Studio or another database:

```bash
npm run db:diff -- -f your_migration_name
```

This will compare your linked database schema with your migration history and generate a new migration file.

### Applying Migrations

#### To Production Database

The recommended approach is to use the Supabase CLI to push migrations:

```bash
npm run db:migrate
```

This command:
1. Connects to your remote Supabase database
2. Checks which migrations have been applied
3. Applies any pending migrations in order
4. Records the migration in the migration history

**Note:** You need to link your project first:

```bash
npx supabase link --project-ref your-project-ref
```

Your project ref can be found in your Supabase project URL: `https://[project-ref].supabase.co`

#### To Local Database

For local development with local Supabase:

```bash
npx supabase db reset
```

This will:
1. Drop the local database
2. Recreate it from scratch
3. Apply all migrations in order

### Checking Migration Status

To see which migrations have been applied:

```bash
npm run db:status
```

This shows:
- Applied migrations (with timestamps)
- Pending migrations
- Migration file names and versions

### Rolling Back Migrations

Supabase CLI doesn't support automatic rollbacks. To rollback:

1. **Write a new migration** that reverses the changes:

```sql
-- Rollback: Remove teams table
DROP TABLE IF EXISTS public.teams;
```

2. **Or restore from a backup:**

```bash
# In Supabase Dashboard:
# Database → Backups → Restore
```

**Best Practice:** Always test migrations in a staging environment before applying to production.

## Migration Best Practices

### 1. Use Idempotent Migrations

Always use `IF NOT EXISTS` and `IF EXISTS` clauses:

```sql
-- Good
CREATE TABLE IF NOT EXISTS public.teams (...);
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS team_id UUID;
DROP TABLE IF EXISTS public.old_table;

-- Avoid
CREATE TABLE public.teams (...);  -- Will fail if table exists
```

### 2. Add Indexes for Common Queries

```sql
CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players(team_id);
```

### 3. Use Constraints for Data Integrity

```sql
ALTER TABLE public.players 
  ADD CONSTRAINT fk_players_team 
  FOREIGN KEY (team_id) 
  REFERENCES public.teams(id)
  ON DELETE SET NULL;
```

### 4. Document Your Schema

```sql
COMMENT ON TABLE public.teams IS 'Stores team information';
COMMENT ON COLUMN public.teams.name IS 'Official team name';
```

### 5. Handle Data Migrations Carefully

For data migrations that might take time:

```sql
-- Add new column with default
ALTER TABLE public.players ADD COLUMN team_id UUID DEFAULT NULL;

-- Backfill data in batches (if needed)
-- This prevents long locks on large tables
UPDATE public.players 
SET team_id = 'default-team-id'
WHERE team_id IS NULL
LIMIT 1000;
```

### 6. Test Migrations Locally

Always test migrations locally or in a staging environment:

```bash
# Start local Supabase
npx supabase start

# Apply migrations
npx supabase db reset

# Verify the schema
npx supabase db diff
```

### 7. Version Control

- **Always commit migrations to version control**
- Use descriptive migration names
- Include comments explaining complex changes
- One logical change per migration file

### 8. Naming Conventions

Use descriptive, action-oriented names:

```
20231227100000_create_players_table.sql
20231227110000_add_team_id_to_players.sql
20231227120000_create_teams_table.sql
20231227130000_add_indexes_for_player_queries.sql
```

## Common Migration Patterns

### Adding a New Table

```sql
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_teams_updated_at 
  BEFORE UPDATE ON public.teams 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
```

### Adding a Column

```sql
ALTER TABLE public.players 
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id);

CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players(team_id);
```

### Renaming a Column (with data preservation)

```sql
-- Add new column
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Copy data
UPDATE public.players SET full_name = first_name || ' ' || last_name;

-- (Optional) Drop old columns in a future migration after verification
-- ALTER TABLE public.players DROP COLUMN IF EXISTS first_name;
-- ALTER TABLE public.players DROP COLUMN IF EXISTS last_name;
```

### Adding Enum Type

```sql
-- Create enum type
DO $$ BEGIN
  CREATE TYPE player_position AS ENUM ('goalkeeper', 'defender', 'midfielder', 'forward');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Use in table
ALTER TABLE public.players 
  ALTER COLUMN position TYPE player_position 
  USING position::player_position;
```

## CI/CD Integration

### Automated Migrations on Deploy

See `.github/workflows/migrate.yml` for the automated migration workflow that runs on deployment.

The workflow:
1. Triggers on push to `main` branch
2. Installs dependencies
3. Links to the Supabase project
4. Applies pending migrations
5. Reports success/failure

### Manual Migration in CI

For manual control, add this step to your existing CI/CD pipeline:

```yaml
- name: Run Database Migrations
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
  run: |
    npx supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    npx supabase db push
```

## Troubleshooting

### Migration Failed to Apply

1. **Check the error message** in the CLI output
2. **Verify your SQL syntax** - test locally first
3. **Check for conflicts** - ensure migration is idempotent
4. **Review migration order** - ensure dependencies are met

### Migration Applied but Schema Incorrect

1. **Review the migration file** for typos or logic errors
2. **Create a new migration** to fix the issue
3. **Never edit applied migrations** - this breaks history

### Local and Remote Schema Out of Sync

```bash
# Generate a diff to see what changed
npm run db:diff

# Reset local to match migrations
npx supabase db reset
```

### Permission Errors

Ensure your `SUPABASE_KEY` is the **service role key** (not anon key) which has full database permissions.

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For questions or issues:
- Check the [Supabase Discord](https://discord.supabase.com/)
- Review [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
- Consult the TeamCore team documentation
