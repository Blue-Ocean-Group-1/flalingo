import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  word: { type: String, required: true },
  translatedWord: { type: String, required: true },
  options: [
    {
      type: Map,
      of: String,
      required: true,
    },
  ],
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export { flashcardSchema, Flashcard };
