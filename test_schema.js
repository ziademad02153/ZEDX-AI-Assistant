const fs = require('fs');
const env = require('dotenv').parse(fs.readFileSync('.env.local'));
const { createClient } = require('@supabase/supabase-js');
const key = env.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.replace(/"/g, '') : '';
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key);
async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log(data);
}
check();
