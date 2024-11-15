import mongoose from 'mongoose';

const chatroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

export const Chatroom = mongoose.model('Chatroom', chatroomSchema);
