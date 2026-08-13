import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Keep-Alive Cron Job
 * Sends a simple request to Supabase every 3 days to prevent automatic project pausing
 * Called via Vercel Cron Jobs (vercel.json)
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Send a simple request to keep the project active
    const { error } = await supabase.from('interviews').select('id').limit(1);

    if (error) {
      console.error('[keep-alive] ping failed:', error.message);
      return NextResponse.json(
        { success: false, error: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    console.log('[keep-alive] ping OK at', new Date().toISOString());
    return NextResponse.json({
      success: true,
      message: 'Supabase project is alive!',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
