import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // TODO: Define user schema
});

export const User = mongoose.model('User', userSchema);
