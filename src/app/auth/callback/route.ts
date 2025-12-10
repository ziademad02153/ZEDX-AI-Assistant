import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.session) {
            // Create response with redirect
            const response = NextResponse.redirect(new URL('/dashboard', request.url));

            // Set auth cookie
            const sessionId = data.session.access_token.slice(0, 32);
            response.cookies.set('auth_token', sessionId, {
                path: '/',
                maxAge: 86400,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });

            return response;
        }
    }

    // Redirect to login on error
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
}
