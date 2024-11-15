import express from 'express';

import { getUsers, getUserById, getDailyWords, addDeckProgress } from '../controllers/user.controller.js';

const userRouter = express.Router();

//base url is /users

userRouter.get('/', getUsers);

userRouter.get('/:id', getUserById);

userRouter.get('/:id/dailyWords', getDailyWords);

userRouter.post('/deckProgress', addDeckProgress);

export default userRouter;
