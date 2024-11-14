import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  // TODO: Define message schema
});

export const Flashcard = mongoose.model('Flashcard', flashcardSchema);
