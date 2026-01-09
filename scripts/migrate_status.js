const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  // Minimal schema definition to allow updates to validation-strict fields if any
  email: String,
  status: String,
}, { strict: false }); // Use strict: false to allow updates without full schema def

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // Find users without status or with null status
    const usersToUpdate = await User.find({ 
        $or: [
            { status: { $exists: false } }, 
            { status: null }
        ] 
    });

    console.log(`Found ${usersToUpdate.length} users with missing status.`);

    for (const user of usersToUpdate) {
        // Default to active
        await User.updateOne({ _id: user._id }, { $set: { status: 'active' } });
        console.log(`Updated user ${user.email} (_id: ${user._id}) to status: active`);
    }

    console.log('Migration complete.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
