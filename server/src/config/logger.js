import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const levels = {
  error: 0, // Application errors
  warn: 1, // Warnings
  info: 2, // General information
  http: 3, // HTTP requests
  query: 4, // Database operations
  debug: 5, // Debug information
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  query: 'cyan',
  debug: 'white',
};

winston.addColors(colors);

const buildFormat = () => {
  const formatters = [];

  formatters.push(winston.format.colorize({ all: true }));

  if (process.env.LOG_TIMESTAMPS) {
    formatters.push(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      })
    );
  }

  if (process.env.PRETTY_LOGGING) {
    formatters.push(
      winston.format.printf((info) => {
        const base = `${info.level}: ${info.message}`;

        const data = info[Symbol.for('splat')];
        const details = data?.length
          ? `\n${JSON.stringify(data[0], null, 2)}`
          : '';

        return process.env.LOG_TIMESTAMPS
          ? `${info.timestamp} ${base}${details}`
          : `${base}${details}`;
      })
    );
  } else {
    formatters.push(winston.format.json());
  }

  return winston.format.combine(...formatters);
};

const logger = winston.createLogger({
  level: process.env.DEBUG_MODE ? 'debug' : process.env.LOG_LEVEL,
  levels,
  silent: process.env.SILENT,
  format: buildFormat(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const originalLogger = {
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  info: logger.info.bind(logger),
  http: logger.http.bind(logger),
  query: logger.query.bind(logger),
  debug: logger.debug.bind(logger),
};

logger.error = (message, data = null) => {
  if (!process.env.LOG_ERRORS) return;
  originalLogger.error(message, data);
};

logger.http = (message, data = null) => {
  if (!process.env.LOG_REQUESTS) return;
  originalLogger.http(message, data);
};

logger.query = (message, data = null) => {
  if (!process.env.LOG_QUERIES) return;
  originalLogger.query(message, data);
};

logger.debug = (message, data = null) => {
  if (!process.env.DEBUG_MODE) return;
  originalLogger.debug(message, data);
};

export default logger;
