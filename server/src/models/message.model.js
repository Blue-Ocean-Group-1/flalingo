import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // TODO: Define message schema
});

export const Message = mongoose.model('Message', messageSchema);
