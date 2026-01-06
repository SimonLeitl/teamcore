# Supabase Configuration

This directory contains all Supabase-related configuration and database migrations for TeamCore.

## Directory Structure

```
supabase/
├── migrations/           # SQL migration files (version controlled)
│   └── YYYYMMDDHHMMSS_description.sql
├── seed/                 # Seed data for local development
│   └── seed.sql
└── config.toml           # Local Supabase configuration
```

## Files

### `config.toml`
Configuration file for local Supabase development. This configures the local Supabase instance when running `npx supabase start`.

**Key settings:**
- Database port: 54322
- API port: 54321
- Studio port: 54323
- Auth configuration
- Storage settings

### `migrations/`
Contains all database schema migrations in SQL format. Files are named with timestamps to ensure correct ordering.

**Naming convention:** `YYYYMMDDHHMMSS_description.sql`

Example:
- `20231227000000_initial_schema.sql` - Creates the initial players table
- `20231227120000_add_teams_table.sql` - Adds teams functionality

**Important:**
- Never modify applied migrations
- Always create new migrations for schema changes
- Use idempotent SQL (IF EXISTS, IF NOT EXISTS)
- Commit all migrations to version control

### `seed/`
Contains seed data files for populating the database during local development and testing.

**Files:**
- `seed.sql` - Sample player data for testing

**Usage:**
```bash
npx supabase db reset  # Applies migrations and runs seed
```

## Quick Commands

```bash
# Create a new migration
npm run migrate:create your_migration_name

# List all migrations
npm run migrate:list

# Apply migrations to production
npm run db:migrate

# Check migration status
npm run db:status

# Generate migration from schema diff
npm run db:diff -- -f migration_name
```

## Local Development

### Start Local Supabase

```bash
npx supabase start
```

This will:
1. Start a local PostgreSQL database
2. Apply all migrations
3. Run seed data (if configured)
4. Start Supabase Studio at http://localhost:54323

### Stop Local Supabase

```bash
npx supabase stop
```

### Reset Local Database

```bash
npx supabase db reset
```

This will drop and recreate the local database, then apply all migrations.

## Production Migrations

Migrations to production are applied via:

1. **Automated (Recommended):** Push to `main` branch triggers GitHub Actions workflow
2. **Manual:** Run `npm run db:migrate` with proper credentials

See [MIGRATIONS.md](../MIGRATIONS.md) for detailed documentation.

## Best Practices

1. **Test Locally First:** Always test migrations on local Supabase before applying to production
2. **Idempotent SQL:** Use `IF EXISTS` and `IF NOT EXISTS` clauses
3. **Small Changes:** One logical change per migration
4. **Descriptive Names:** Use clear, action-oriented migration names
5. **Rollback Plan:** Document how to reverse changes
6. **Never Edit:** Never modify applied migrations - create new ones instead

## Resources

- [Supabase Migrations Documentation](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [TeamCore Migration Guide](../MIGRATIONS.md)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
