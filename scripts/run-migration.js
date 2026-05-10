#!/usr/bin/env node
/**
 * Database Migration Script
 * Executes the Phase 1 marketplace schema in Supabase
 */

const fs = require('fs');
const path = require('path');

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('📦 Running Phase 1 marketplace migration...\n');

  const migrationSQL = fs.readFileSync(
    path.join(__dirname, '../supabase/phase1-marketplace.sql'),
    'utf-8'
  );

  try {
    // Split SQL into statements and filter empty ones
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📋 Executing ${statements.length} SQL statements...\n`);

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({
        sql: migrationSQL,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Created:');
    console.log('  • listings table');
    console.log('  • listing_images table');
    console.log('  • saved_listings table');
    console.log('  • RLS policies');
    console.log('  • Storage bucket (listing-images)');
    console.log('  • Indexes for performance\n');
    console.log('🚀 You can now sign up and start using the marketplace!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n💡 Manual alternative:');
    console.error('1. Go to: https://supabase.com/dashboard');
    console.error('2. Open your project');
    console.error('3. Click "SQL Editor"');
    console.error('4. Click "New query"');
    console.error('5. Paste contents of supabase/phase1-marketplace.sql');
    console.error('6. Click "Run"\n');
    process.exit(1);
  }
}

runMigration();
