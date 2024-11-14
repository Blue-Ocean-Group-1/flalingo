import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  translatedWord: { type: String, required: true },
  options: [
    { text: String, correct: Boolean }  // Indicates correct/incorrect answer
  ],
  skillLevel: { type: String, enum: ['beginner', 'proficient', 'advanced'], required: true },
});

export const Flashcard = mongoose.model('Flashcard', flashcardSchema);
