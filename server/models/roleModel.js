import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema({
  value: { type: String, unique: true, default: 'USER' },
});

export const Role = mongoose.model('Role', RoleSchema);
