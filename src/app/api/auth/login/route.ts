import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { comparePassword, signJWT, AUTH_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
// Import Role to ensure schema is registered before populate
import '@/lib/models/Role'; 

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // 1. Find User & Populate Role
        // .select('+password') if we set select:false in schema, but we didn't.
        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Validate Password
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Check Account Status
        if (user.status && user.status !== 'active') {
            return NextResponse.json({ error: 'Your account has been blocked or is inactive. Please contact support.' }, { status: 403 });
        }

        // 3. Create Token Payload
        // Access role fields via .role which is populated
        const roleData = user.role as any; // Type assertion as populated
        
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: roleData.name,
            permissions: [...roleData.permissions] // Spread to convert Mongoose Array to JS Array
        };

        // 4. Sign Token
        const token = await signJWT(payload);

        // 5. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
        });

        const responseUser = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: roleData.name,
            permissions: roleData.permissions,
            status: user.status
        };

        return NextResponse.json({ 
            success: true, 
            user: responseUser
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
