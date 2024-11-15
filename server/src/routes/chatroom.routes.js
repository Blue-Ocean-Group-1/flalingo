import express from 'express';
import RateLimit from 'express-rate-limit';
import { getChatrooms } from '../controllers/chatroom.controller.js';

const chatroomsRouter = express.Router();

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// apply rate limiter to the getChatrooms route
chatroomsRouter.get('/', limiter, getChatrooms);

export default chatroomsRouter;
