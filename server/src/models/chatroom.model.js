import mongoose from 'mongoose';

const chatroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  participantCount: { type: Number, default: 0 },
});

export const Chatroom = mongoose.model('Chatroom', chatroomSchema);
