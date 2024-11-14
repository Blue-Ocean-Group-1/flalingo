import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  flashcards: [FlashcardSchema]
});

export const Deck = mongoose.model('Deck', deckSchema);
