require('dotenv').config({path: '.env.local'});
const { createClient } = require('@supabase/supabase-js');
let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (key && key.startsWith('"')) { key = key.replace(/"/g, ''); }
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);
async function fix() {
    const { data, error } = await supabase.rpc('execute_sql', { query: ALTER TYPE user_tier ADD VALUE IF NOT EXISTS 'ultra' });
    console.log('Result:', data, error);
}
fix();
