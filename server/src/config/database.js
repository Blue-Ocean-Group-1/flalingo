import mongoose from 'mongoose';

import { env } from '../config/env.js';

import logger from './logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
