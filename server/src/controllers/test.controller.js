import logger from '../config/logger.js';
import { AppError } from '../middleware/errorLogger.js';

export const healthCheck = (req, res) => {
  logger.info('Health check endpoint hit');
  logger.debug('Request path:', req.path);
  res.status(200).json({ status: 'ok', message: 'Server is running' });
};

export const clientError = (req, res, next) => {
  next(new AppError('Bad Request Error', 400));
};

export const serverError = (req, res, next) => {
  next(new AppError('Internal Server Error', 500));
};
