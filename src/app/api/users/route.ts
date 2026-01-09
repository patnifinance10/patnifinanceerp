import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Role from '@/lib/models/Role'; // Ensure Role model is loaded
import { verifyJWT, AUTH_COOKIE_NAME, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { PERMISSIONS } from '@/lib/constants/permissions';

async function checkAccess(req: Request, requiredPermission: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return false;
    
    const payload = await verifyJWT(token);
    if (!payload) return false;

    const userPayload = payload as any;
    if (userPayload.role === 'Admin' || userPayload.role === 'super_admin') return true;

    return userPayload.permissions?.includes(requiredPermission);
}

export async function GET(req: Request) {
    try {
        if (!await checkAccess(req, PERMISSIONS.VIEW_USERS)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        // Populate role name
        const users = await User.find({})
            .select('-password')
            .populate('role', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Fetch Users Error:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!await checkAccess(req, PERMISSIONS.CREATE_USER)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const { email, password, name, roleId } = body;

        if (!email || !password || !name || !roleId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const roleToCheck = await Role.findById(roleId);
        if (!roleToCheck) {
             return NextResponse.json({ error: 'Invalid Role' }, { status: 400 });
        }
        
        if (roleToCheck.name === 'Admin') {
            return NextResponse.json({ error: 'Cannot assign Admin role manually' }, { status: 403 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role: roleId,
            status: 'active' // Explicitly set status
        });

        const userObject = user.toObject();
        delete userObject.password;

        return NextResponse.json({ user: userObject }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
