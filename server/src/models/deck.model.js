import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  theme: { type: String, required: true },
  skillLevel: { type: String, enum: ['beginner', 'proficient', 'advanced'], required: true },
  flashcards: [{
    word: { type: String, required: true },
    translatedWord: { type: String, required: true },
    options: [
      {
        type: Map,
        of: String,
        required: true
      }
    ]
  }]
});

const Deck = mongoose.model('Deck', deckSchema);

export { Deck, deckSchema };
