import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  chatroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true,
  },
});

export const Message = mongoose.model('Message', messageSchema);
