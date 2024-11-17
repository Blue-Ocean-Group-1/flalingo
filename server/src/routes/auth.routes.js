import express from 'express';
import RateLimit from 'express-rate-limit';
import passport from 'passport';

import {
  register,
  login,
  protectedRoute,
} from '../controllers/auth.controller.js';

const router = express.Router();

const loginLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  protectedRoute,
);

export default router;
