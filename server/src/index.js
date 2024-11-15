// src/index.js
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import { connectDB } from './config/database.js';
import { env, validateEnv } from './config/env.js';
import logger from './config/logger.js';
import { errorLogger, AppError } from './middleware/errorLogger.js';
import { requestLogger } from './middleware/requestLogger.js';
import { messageRouter, testRouter, userRouter, deckRouter } from './routes/index.js';

validateEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/messages', messageRouter);
app.use('/api/users', userRouter);
app.use('/api/test', testRouter);
app.use('/api/decks', deckRouter);

// Development settings
if (env.isDevelopment) {
  mongoose.set('debug', true);
} else if (env.isProduction) {
  mongoose.set('debug', false);
}

app.use((req, res, next) => {
  logger.warn(`Not Found - ${req.method} ${req.originalUrl}`);
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
});

app.use(errorLogger);

// connect to DB
connectDB();

// start server
const PORT = env.PORT ?? 3000;
const MONGODB_URI = env.MONGODB_URI ?? 'mongodb://localhost:27017/polyglot';
const SERVER_HOST = env.SERVER_HOST ?? 'localhost';
const NODE_ENV = env.NODE_ENV ?? 'development';

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`MongoDB URI: ${MONGODB_URI}`);
  logger.info(`visit http://${SERVER_HOST}:${PORT}`);
});

export default app;
