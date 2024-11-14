import mongoose from 'mongoose';

const chatroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [MessageSchema]
});

export const Chatroom = mongoose.model('Chatroom', chatroomSchema);
