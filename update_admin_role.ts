import dbConnect from './src/lib/db';
import Role from './src/lib/models/Role';
import { PERMISSIONS } from './src/lib/constants/permissions';

async function updateAdminPermissions() {
    try {
        console.log('Connecting to DB...');
        await dbConnect();

        console.log('Finding Admin role...');
        const adminRole = await Role.findOne({ name: 'Admin' });

        if (!adminRole) {
            console.error('Admin role not found!');
            process.exit(1);
        }

        console.log('Current Admin Permissions Count:', adminRole.permissions.length);

        // Force update to all current permissions
        const allPermissions = Object.values(PERMISSIONS);
        adminRole.permissions = allPermissions;
        
        await adminRole.save();

        console.log('SUCCESS: Admin role updated to full access.');
        console.log('Total Permissions Assigned:', allPermissions.length);
        console.log(allPermissions);

        process.exit(0);
    } catch (error) {
        console.error('Error updating Admin role:', error);
        process.exit(1);
    }
}

updateAdminPermissions();
