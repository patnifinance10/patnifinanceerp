import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Role from '@/lib/models/Role';
import { verifyJWT, AUTH_COOKIE_NAME, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { PERMISSIONS, SYSTEM_ROOT_EMAIL } from '@/lib/constants/permissions';

async function checkAccess(requiredPermission: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return false;
    
    const payload = await verifyJWT(token) as any;
    if (!payload) return false;

    if (payload.role === 'Admin' || payload.role === 'super_admin') return true;

    return payload.permissions?.includes(requiredPermission);
}

// UPDATE USER (Admin Only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await checkAccess(PERMISSIONS.EDIT_USER)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params; // Fix 1: Extract id
        const body = await req.json(); // Fix 2: Extract body once

        console.log(`[PUT User] ID: ${id}, Body:`, body);

        // Fetch user to check if it's super admin
        const targetUser = await User.findById(id);
        if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (targetUser.email === SYSTEM_ROOT_EMAIL) {
             const { status, roleId, email } = body; // Use extracted body
             if (status || roleId || email) {
                return NextResponse.json({ error: 'Cannot change Role, Status, or Email of System Root user' }, { status: 403 });
             }
        }

        const updateData: any = {};
        const { status, roleId, password, name } = body; // Use extracted body

        if (name) updateData.name = name; // detailed update
        if (status) updateData.status = status;
        if (roleId) {
            const roleToCheck = await Role.findById(roleId);
            if (roleToCheck && roleToCheck.name === 'Admin') {
                return NextResponse.json({ error: 'Cannot assign Admin role manually' }, { status: 403 });
            }
            updateData.role = roleId;
        }
        
        console.log(`[PUT User] UpdateData:`, updateData);
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const user = await User.findByIdAndUpdate(
            id, 
            { $set: updateData },
            { new: true }
        ).select('-password');

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE USER (Admin Only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!await checkAccess(PERMISSIONS.DELETE_USER)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        
        const targetUser = await User.findById(id);
        if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        if (targetUser.email === SYSTEM_ROOT_EMAIL) {
            return NextResponse.json({ error: 'Cannot delete System Root user' }, { status: 403 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
