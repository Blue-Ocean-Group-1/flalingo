import express from 'express';
import RateLimit from 'express-rate-limit';

import {
  getUsers,
  getUserById,
  getDailyWords,
  addDeckProgress,
} from '../controllers/user.controller.js';

const userRouter = express.Router();

//base url is /users

const getUserByIdLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

userRouter.get('/', getUsers);

userRouter.get('/:id', getUserByIdLimiter, getUserById);

userRouter.get('/:id/dailyWords', getDailyWords);

userRouter.post('/deckProgress', addDeckProgress);

export default userRouter;
