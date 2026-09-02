const fs = require('fs');
const env = require('dotenv').parse(fs.readFileSync('.env.local'));
const { createClient } = require('@supabase/supabase-js');
const key = env.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.replace(/"/g, '') : '';
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);
async function run() {
  const { data, error } = await supabase.rpc('execute_sql', { query: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE; });
  console.log('Done', error || '');
}
run();
