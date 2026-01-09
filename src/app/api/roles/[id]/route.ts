import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Role from '@/lib/models/Role';
import User from '@/lib/models/User';
import { verifyJWT, AUTH_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { PERMISSIONS } from '@/lib/constants/permissions';

export const dynamic = 'force-dynamic';

async function checkAccess(requiredPermission: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return false;
    
    const payload = await verifyJWT(token) as any;
    if (!payload) return false;

    if (payload.role === 'Admin' || payload.role === 'super_admin') return true;

    return payload.permissions?.includes(requiredPermission);
}

// UPDATE ROLE
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await checkAccess(PERMISSIONS.EDIT_SETTINGS)) { // Using EDIT_SETTINGS for role management as per plan
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { name, permissions } = body;

        const role = await Role.findById(id);
        if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });

        if (role.name === 'Admin') {
            return NextResponse.json({ error: 'Cannot modify the System Admin role' }, { status: 403 });
        }

        if (name) role.name = name;
        if (permissions) role.permissions = permissions;

        await role.save();

        return NextResponse.json({ role });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Role name already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}

// DELETE ROLE
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await checkAccess(PERMISSIONS.EDIT_SETTINGS)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;

        const role = await Role.findById(id);
        if (!role) return NextResponse.json({ error: 'Role not found' }, { status: 404 });

        if (role.name === 'Admin') {
            return NextResponse.json({ error: 'Cannot delete the System Admin role' }, { status: 403 });
        }

        // Check if any users are assigned to this role
        // Need to import User model at top if not present, but for now we use dynamic import or ensure it's imported
        const userCount = await User.countDocuments({ role: id });
        if (userCount > 0) {
            return NextResponse.json({ 
                error: `Cannot delete role. There are ${userCount} users assigned to this role.` 
            }, { status: 409 }); // 409 Conflict
        }

        await Role.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
    }
}
