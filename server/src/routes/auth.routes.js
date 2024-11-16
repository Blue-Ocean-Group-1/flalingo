import express from 'express';
import passport from 'passport';

import {
  register,
  login,
  protectedRoute,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  protectedRoute,
);

export default router;
