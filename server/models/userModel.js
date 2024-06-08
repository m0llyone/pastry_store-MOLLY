import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }],
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        return {
          id: ret._id,
          email: ret.email,
          password: ret.password,
          roles: ret.roles,
        };
      },
    },
  },
);

export const User = mongoose.model('User', UserSchema);
