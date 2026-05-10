const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
dotenv.config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!url || !key) {
  console.error('Missing Supabase URL or service role key in environment');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function listColumns(table) {
  try {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error('Error selecting from', table, error.message || error);
      return null;
    }

    if (!data || data.length === 0) {
      // No rows; we cannot infer columns, but the table exists.
      return [];
    }

    // Return keys of first row as column names
    return Object.keys(data[0]).map((k) => ({ column_name: k, data_type: typeof data[0][k] }));
  } catch (err) {
    console.error('Unexpected error', err.message || err);
    return null;
  }
}

(async () => {
  console.log('Inspecting DB schema...');
  const tables = ['listings', 'listing_images', 'categories', 'saved_listings'];
  for (const t of tables) {
    const cols = await listColumns(t);
    console.log(`\nTable: ${t}`);
    if (!cols) {
      console.log('  (no results)');
      continue;
    }
    for (const c of cols) {
      console.log(`  - ${c.column_name} (${c.data_type})`);
    }
  }

  // Probe likely column names when empty or unknown
  const probes = {
    listing_images: ['storage_path', 'path', 'file_path', 'url', 'public_url', 'uri', 'image_path', 'filepath'],
    listings: ['category', 'category_id'],
  };

  for (const [table, fields] of Object.entries(probes)) {
    console.log(`\nProbing ${table} for candidate columns...`);
    for (const field of fields) {
      try {
        const { data, error } = await supabase.from(table).select(field).limit(1);
        if (error) {
          console.log(`  - ${field}: ERROR (${error.message})`);
        } else {
          console.log(`  - ${field}: OK`);
        }
      } catch (err) {
        console.log(`  - ${field}: EXCEPTION (${err.message})`);
      }
    }
  }
  process.exit(0);
})();