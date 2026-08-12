import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Keep-Alive Cron Job
 * يُرسل طلباً بسيطاً لـ Supabase كل 3 أيام لمنع إيقاف المشروع تلقائياً
 * يتم استدعاؤه عبر Vercel Cron Jobs (vercel.json)
 *
 * الحماية: يتحقق من CRON_SECRET لمنع الاستدعاء غير المصرح به
 */
export async function GET(request: Request) {
  // التحقق من الـ Secret لمنع الاستدعاء غير المصرح به
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Missing Supabase environment variables' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // إرسال طلب بسيط جداً لإبقاء المشروع نشطاً
  const { error } = await supabase.rpc('version').maybeSingle().catch(() => ({
    error: null,
  }));

  // محاولة بديلة إذا فشلت الأولى
  if (error) {
    const { error: fallbackError } = await supabase
      .from('interviews')
      .select('id')
      .limit(1);

    if (fallbackError) {
      console.error('[keep-alive] Supabase ping failed:', fallbackError.message);
      return NextResponse.json(
        { success: false, error: fallbackError.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }
  }

  console.log('[keep-alive] Supabase ping successful at', new Date().toISOString());

  return NextResponse.json({
    success: true,
    message: 'Supabase project is alive!',
    timestamp: new Date().toISOString(),
  });
}
