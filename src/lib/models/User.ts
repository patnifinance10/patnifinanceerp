import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: mongoose.Types.ObjectId;
  status: 'active' | 'blocked' | 'inactive';
  avatarUrl?: string;
  mobile?: string;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'inactive'],
    default: 'active'
  },
  avatarUrl: String,
  mobile: String,
}, { 
  timestamps: true 
});

// Export model
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
