import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profilePicture: { type: String, default: null },
  demographics: {
    age: Number,
    gender: String,
    country: String,
    zipcode: { type: String, default: null },
  },
  activeLanguages: [String],
  allLanguages: [String],
  progress: [
    {
      language: { type: String, required: true },
      skillLevel: { type: String, required: true, default: 'beginner' },
      decks: [
        {
          deckName: { type: String, required: true },
          deck_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Deck',
            required: true,
          },
          skillLevel: { type: String, required: true },
          timesCompleted: [
            {
              attemptNo: { type: Number, required: true },
              totalCorrect: { type: Number, required: true },
              date: { type: Date, required: true },
            },
          ],
          perWordCorrect: [
            {
              word: { type: String, required: true },
              correct: { type: Number, required: true },
            },
          ],
        },
      ],
    },
  ],
  streaks: [
    {
      highestFlashcard: { type: Number, default: 0 },
      currentFlashcard: { type: Number, default: 0 },
    },
  ],
  dailyWords: {
    type: [
      {
        date: { type: Date, required: true },
        words: {
          type: [{ word: { type: String }, translatedWord: { type: String } }],
          required: true,
        },
        deckName: { type: String, required: true },
      },
    ],
    default: [],
  },
  dailyGoalProgress: [
    { date: { type: Date }, completed: { type: Boolean, default: false } },
  ],
  currentLoginStreak: Number,
  longestLoginStreak: Number,
  loginHistory: [{ type: Date, dailyGoalsCompleted: Boolean }],
  timeUsingApp: Number,
  topBadges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  allBadges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  gems: { type: Number, default: 0 },
});

export const User = mongoose.model('User', userSchema);
