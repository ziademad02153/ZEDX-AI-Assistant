import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Define protected routes
    const protectedPaths = ['/dashboard', '/interview'];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtected) {
        // Check for auth_token cookie
        const token = request.cookies.get('auth_token');

        if (!token || !token.value) {
            // Redirect to login if no token found
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Basic token format validation (should be 32 chars)
        // Full validation happens client-side with Supabase
        if (token.value.length < 20) {
            // Invalid token format, clear it and redirect
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/interview/:path*',
    ],
};
