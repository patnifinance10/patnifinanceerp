import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: Request) {
    const cookieStore = await cookies();
    
    // Delete the auth cookie
    cookieStore.delete(AUTH_COOKIE_NAME);

    // Return success
    return NextResponse.json({ success: true });
}
