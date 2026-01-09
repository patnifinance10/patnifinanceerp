import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        
        // Update all users where status is missing
        const result = await User.updateMany(
            { $or: [{ status: { $exists: false } }, { status: null }] },
            { $set: { status: 'active' } }
        );

        return NextResponse.json({ 
            success: true, 
            message: `Updated ${result.modifiedCount} users`,
            matched: result.matchedCount
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
