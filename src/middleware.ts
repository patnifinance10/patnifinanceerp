import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-default-key-change-me-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

// Routes that require authentication (Not strictly needed if we protect everything else, but good for clarity)
// We will simply check if the user is visiting a public route.
const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/debug'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow Public Routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2. Allow Static Assets & Next.js Internals (Already handled by config matcher, but double check)
    if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
         return NextResponse.next();
    }

    // 3. Verify Token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', request.url);
        // Optional: Add ?from=pathname to redirect back after login
        return NextResponse.redirect(loginUrl);
    }

    try {
        await jwtVerify(token, key);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
