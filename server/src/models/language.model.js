import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skillLevels: [
    {
      level: { type: String, enum: ['beginner', 'proficient', 'advanced'] },
      decks: [DeckSchema]
    }
  ]
});

export const Language = mongoose.model('Language', languageSchema);
