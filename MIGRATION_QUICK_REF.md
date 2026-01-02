# Migration Quick Reference

Quick reference card for common database migration operations in TeamCore.

## 🚀 Quick Commands

### Create New Migration
```bash
npm run migrate:create add_teams_table
```

### List All Migrations
```bash
npm run migrate:list
```

### Apply Migrations to Production
```bash
# First, link your Supabase project (one-time setup)
npx supabase link --project-ref YOUR_PROJECT_REF

# Then apply migrations
npm run db:migrate
```

### Check Migration Status
```bash
npm run db:status
```

### Generate Migration from Schema Changes
```bash
npm run db:diff -- -f migration_name
```

## 🏠 Local Development

### Start Local Supabase
```bash
npx supabase start
```
- Database: http://localhost:54322
- API: http://localhost:54321
- Studio: http://localhost:54323

### Stop Local Supabase
```bash
npx supabase stop
```

### Reset Local Database
```bash
npx supabase db reset
```
This drops and recreates the database, applying all migrations.

## 📝 Migration File Template

```sql
-- Migration: [Description]
-- Created at: [ISO timestamp]

-- Create table
CREATE TABLE IF NOT EXISTS public.your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_your_table_name 
  ON public.your_table(name);

-- Add trigger for updated_at
CREATE TRIGGER update_your_table_updated_at 
  BEFORE UPDATE ON public.your_table 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
```

## 🔒 Best Practices

✅ **DO:**
- Use `IF NOT EXISTS` and `IF EXISTS` clauses
- Test migrations locally before production
- Use descriptive migration names
- Commit migrations to version control
- One logical change per migration
- Add comments explaining complex changes

❌ **DON'T:**
- Never edit applied migrations
- Don't skip testing in staging
- Don't use non-idempotent SQL
- Don't commit directly to production

## 🤖 Automated Migrations

Migrations are automatically applied when:
1. Changes to `supabase/migrations/` are pushed to `main` branch
2. GitHub Actions workflow runs successfully

## 📚 Full Documentation

For comprehensive documentation, see:
- [MIGRATIONS.md](./MIGRATIONS.md) - Complete migration guide
- [supabase/README.md](./supabase/README.md) - Supabase directory structure

## 🆘 Troubleshooting

### Migration Failed
1. Check error message in CLI output
2. Verify SQL syntax
3. Ensure migration is idempotent
4. Test locally with `npx supabase db reset`

### Permission Errors
Ensure you're using the **service role key**, not the anon key.

### Schema Out of Sync
```bash
npm run db:diff  # See what changed
npx supabase db reset  # Reset local to match migrations
```

## 📞 Support

- 📖 [Supabase Docs](https://supabase.com/docs/guides/cli)
- 💬 [Supabase Discord](https://discord.supabase.com/)
- 🐛 [Report Issues](https://github.com/SimonLeitl/teamcore/issues)
