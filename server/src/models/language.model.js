import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  // TODO: Define message schema
});

export const Language = mongoose.model('Language', languageSchema);
