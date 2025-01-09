import { Schema, model } from 'mongoose';
import IUser from '../interfaces/user.interface';

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
  },
});

userSchema.pre<IUser>(/^find/, function (next) {
  (this as any).select('-password');
  next();
});

const User = model<IUser>('User', userSchema);
export default User;
