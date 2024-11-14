import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  demographics: {
    age: Number,
    gender: String,
    country: String,
    zipcode: { type: String, default: null }
  },
  activeLanguages: [String],
  allLanguages: [String],
  progress: [
    {
      language: String,
      skillLevel: String,
      cardsCorrect: [
        { deck: {type:  mongoose.Schema.Types.ObjectId, ref: 'Deck'},
          cardsCorrect: {type: [mongoose.Schema.Types.ObjectId], ref: 'Flashcard'},
          timesCompleted:{type: Number}
          }]
    }
  ],
  dailyGoalProgress: [{ type: String }],
  currentLoginStreak: Number,
  longestLoginStreak: Number,
  loginHistory: [{ type: Date, dailyGoalsCompleted: Boolean }],
  timeUsingApp: Number,
  topBadges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  allBadges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  gems: { type: Number, default: 0 }
});

export const User = mongoose.model('User', userSchema);
