import mongoose from 'mongoose';

import { deckSchema } from './deck.model.js';

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skillLevels: [
    {
      level: { type: String, enum: ['beginner', 'proficient', 'advanced'] },
      decks: [deckSchema],
    },
  ],
});

export const Language = mongoose.model('Language', languageSchema);
