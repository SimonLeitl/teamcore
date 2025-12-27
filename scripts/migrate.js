#!/usr/bin/env node

/**
 * Migration Helper Script
 * 
 * Provides utilities for creating and managing database migrations.
 * This is a helper tool to make common migration tasks easier.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');

/**
 * Generate a timestamp in the format YYYYMMDDHHMMSS
 */
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Create a new migration file
 */
function createMigration(name) {
  if (!name) {
    console.error('❌ Error: Migration name is required');
    console.log('Usage: node scripts/migrate.js create <migration-name>');
    process.exit(1);
  }

  // Sanitize the migration name
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const timestamp = generateTimestamp();
  const filename = `${timestamp}_${sanitizedName}.sql`;
  const filepath = path.join(MIGRATIONS_DIR, filename);

  const template = `-- Migration: ${name}
-- Created at: ${new Date().toISOString()}
-- Description: Add a description of what this migration does

-- Your SQL migration code here

`;

  fs.writeFileSync(filepath, template, 'utf8');
  console.log(`✅ Created new migration: ${filename}`);
  console.log(`📝 Edit the file at: ${filepath}`);
}

/**
 * List all migrations
 */
function listMigrations() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('No migrations directory found');
    return;
  }

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No migration files found');
    return;
  }

  console.log(`📋 Found ${files.length} migration(s):\n`);
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
🗃️  TeamCore Migration Helper

Usage:
  node scripts/migrate.js <command> [options]

Commands:
  create <name>    Create a new migration file
  list             List all migration files
  help             Show this help message

Examples:
  node scripts/migrate.js create add_teams_table
  node scripts/migrate.js create add_team_id_to_players
  node scripts/migrate.js list

For applying migrations, use npm scripts:
  npm run db:migrate     Apply migrations to remote database
  npm run db:status      Check migration status
  npm run db:diff        Generate migration from schema diff
`);
}

// Main execution
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'create':
    createMigration(arg);
    break;
  case 'list':
    listMigrations();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    if (!command) {
      showHelp();
    } else {
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
    }
}
