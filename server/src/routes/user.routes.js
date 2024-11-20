import express from 'express';
import RateLimit from 'express-rate-limit';
import passport from 'passport';

import {
  getUsers,
  getUserData,
  getUserById,
  getDailyWords,
  addDeckProgress,
  updateUserData,
  getUserReportById,
  initDailyProgress,
} from '../controllers/user.controller.js';

const userRouter = express.Router();

//base url is /users

const getUserByIdLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

const getUserDataLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

userRouter.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  getUserDataLimiter,
  getUserData,
);

userRouter.put(
  '/me',
  passport.authenticate('jwt', { session: false }),
  getUserDataLimiter,
  updateUserData,
);

const getUsersLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
userRouter.get('/', getUsersLimiter, getUsers);
userRouter.get('/:id', getUserByIdLimiter, getUserById);

const getUserReportByIdLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
userRouter.get('/:id/reports', getUserReportByIdLimiter, getUserReportById);

userRouter.get('/:id/dailyWords', getDailyWords);
// userRouter.put('/:id/dailyProgress', initDailyProgress);
userRouter.post('/deckProgress', addDeckProgress);

export default userRouter;
