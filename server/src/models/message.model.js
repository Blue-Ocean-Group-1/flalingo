import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // The sender's ObjectId
  senderName: { type: String, required: true },  // The sender's name
  content: { type: String, required: true },  // The message content
  language: { type: String, required: true },  // The language of the message
  timestamp: { type: Date, default: Date.now }  // The timestamp of the message
});

export const Message = mongoose.model('Message', messageSchema);
