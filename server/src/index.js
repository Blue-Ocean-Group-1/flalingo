// src/index.js
import emailjs from '@emailjs/browser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { connectDB } from './config/database.js';
import { emailJsConfig } from './config/emailJs.config.js';
import { env, validateEnv } from './config/env.js';
import logger from './config/logger.js';
import configurePassport from './config/passport.js';
import { errorLogger, AppError } from './middleware/errorLogger.js';
import { requestLogger } from './middleware/requestLogger.js';
import {
  messageRouter,
  testRouter,
  userRouter,
  deckRouter,
  chatroomRouter,
  sendemailRouter,
  AuthRouter,
  emailRouter,
  languageRouter,
} from './routes/index.js';

// Validate environment variables
validateEnv();
emailjs.init(emailJsConfig);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(passport.initialize());

// Configure Passport
configurePassport(passport);

// Routes

app.use('/api/messages', messageRouter);
app.use('/api/chatrooms', chatroomRouter);
app.use('/api/users', userRouter);
app.use('/api/test', testRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/decks', deckRouter);
app.use('/api/email', emailRouter);
app.use('/api/sendemail', sendemailRouter);
app.use('/api/languages', languageRouter);

// Development settings
if (env.isDevelopment) {
  mongoose.set('debug', true);
} else if (env.isProduction) {
  mongoose.set('debug', false);
}

// 404 Error handling
app.use((req, res, next) => {
  logger.warn(`Not Found - ${req.method} ${req.originalUrl}`);
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
});

// Error logging middleware
app.use(errorLogger);

// Connect to DB
connectDB();

// Start server
const PORT = env.PORT ?? 3000;
const MONGODB_URI = env.MONGODB_URI ?? 'mongodb://localhost:27017/polyglot';
const SERVER_HOST = env.SERVER_HOST ?? 'localhost';
const NODE_ENV = env.NODE_ENV ?? 'development';

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`MongoDB URI: ${MONGODB_URI}`);
    logger.info(`Visit http://${SERVER_HOST}:${PORT}`);
  });
}

// import { Chatroom } from './models/chatroom.model.js';

// mongoose.connection.once('open', () => {
//   Chatroom.updateMany({}, { participantCount: 0 })
//     .then((res) => {
//       console.log('succesfully updated chatrooms');
//     })
//     .catch((err) => console.log(err));
// });

export default app;
