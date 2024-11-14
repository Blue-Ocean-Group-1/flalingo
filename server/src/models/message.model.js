import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  language: { type: String, required: true },  // Specifies the language used in the message
  chatroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom', required: true },  // References the chatroom
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
