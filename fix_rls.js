const fs = require('fs');
const env = require('dotenv').parse(fs.readFileSync('.env.local'));
const { createClient } = require('@supabase/supabase-js');
const key = env.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.replace(/"/g, '') : '';
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);

async function run() {
  const query = `
    -- Revoke general update access
    REVOKE UPDATE ON public.profiles FROM authenticated;
    REVOKE UPDATE ON public.profiles FROM anon;
    
    -- Grant update ONLY on safe columns (e.g., full_name)
    GRANT UPDATE (full_name) ON public.profiles TO authenticated;
  `;
  const { data, error } = await supabase.rpc('execute_sql', { query });
  console.log('DB Security Fix Applied:', error || 'Success');
}
run();
