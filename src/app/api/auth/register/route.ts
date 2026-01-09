import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Role from '@/lib/models/Role';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        const body = await req.json();
        const { email, password, name, secret } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and Password are required' }, { status: 400 });
        }

        // 1. Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // 2. Determine Role
        let roleName = 'field_agent';
        if (secret === 'admin-setup') {
            roleName = 'super_admin';
        }

        const role = await Role.findOne({ name: roleName });

        if (!role) {
            if (roleName === 'super_admin') {
                return NextResponse.json({ error: 'System not initialized. Run seed script.' }, { status: 500 });
            }
             return NextResponse.json({ error: `Default role '${roleName}' not found.` }, { status: 500 });
        }

        // 3. Create User
        const hashedPassword = await hashPassword(password);
        
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name: name || email.split('@')[0],
            role: role._id
        });

        // 4. Return user without password
        const userObject = newUser.toObject();
        delete userObject.password;

        return NextResponse.json({ 
            success: true, 
            user: userObject 
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
