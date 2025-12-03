import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Define protected routes
    const protectedPaths = ['/dashboard', '/interview'];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtected) {
        // Check for auth_token cookie
        const token = request.cookies.get('auth_token');

        if (!token) {
            // Redirect to login if no token found
            const loginUrl = new URL('/login', request.url);
            // Add a return URL to redirect back after login (optional enhancement)
            loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
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
