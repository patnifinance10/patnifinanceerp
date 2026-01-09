import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Role from '@/lib/models/Role';
import { verifyJWT, AUTH_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { PERMISSIONS } from '@/lib/constants/permissions';

async function checkAccess(req: Request, requiredPermission: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return false;
    
    const payload = await verifyJWT(token);
    if (!payload) return false;

    const userPayload = payload as any; 
    // Admin bypass
    if (userPayload.role === 'Admin' || userPayload.role === 'super_admin') return true;

    return userPayload.permissions?.includes(requiredPermission);
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        
        // Optional: Check permission if viewing roles is sensitive, usually it's public for authenticated users to see what roles exist
        // if (!await checkAccess(req, PERMISSIONS.MANAGE_SETTINGS)) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        // }

        const roles = await Role.find({}).sort({ name: 1 });
        return NextResponse.json({ roles });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        if (!await checkAccess(req, PERMISSIONS.EDIT_SETTINGS)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const { name, permissions } = body;

        if (!name) {
            return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
        }

        const role = await Role.create({
            name,
            permissions: permissions || []
        });

        return NextResponse.json({ role }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Role already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
    }
}
