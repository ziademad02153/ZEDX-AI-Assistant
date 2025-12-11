import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error:', error, error_description);
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url));
    }

    if (code) {
        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Exchange code for session
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
                console.error('Session exchange error:', exchangeError);
                return NextResponse.redirect(new URL('/login?error=session_failed', request.url));
            }

            if (data.session) {
                // Create response with redirect
                const response = NextResponse.redirect(new URL('/dashboard', request.url));

                // Set auth cookie
                const sessionId = data.session.access_token.slice(0, 32);
                response.cookies.set('auth_token', sessionId, {
                    path: '/',
                    maxAge: 86400,
                    sameSite: 'lax',
                    secure: true,
                    httpOnly: false,
                });

                return response;
            }
        } catch (e) {
            console.error('Callback error:', e);
        }
    }

    // Redirect to login on error
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
}
