import mongoose from 'mongoose';

const chatroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
});

export const Chatroom = mongoose.model('Chatroom', chatroomSchema);
