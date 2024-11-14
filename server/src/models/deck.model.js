import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
  // TODO: Define message schema
});

export const Deck = mongoose.model('Deck', deckSchema);
