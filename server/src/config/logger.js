import 'dotenv/config.js'; // eslint-disable-line
import winston from 'winston';

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

  if (process.env.LOG_TIMESTAMPS === 'true') {
    formatters.push(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
    );
  }

  if (process.env.PRETTY_LOGGING === 'true') {
    formatters.push(
      winston.format.printf((info) => {
        const base = `${info.level}: ${info.message}`;

        const data = info[Symbol.for('splat')];
        const details = data?.length
          ? `\n${JSON.stringify(data[0], null, 2)}`
          : '';

        return process.env.LOG_TIMESTAMPS === 'true'
          ? `${info.timestamp} ${base}${details}`
          : `${base}${details}`;
      }),
    );
  } else {
    formatters.push(winston.format.json());
  }

  return winston.format.combine(...formatters);
};

const logger = winston.createLogger({
  level: process.env.DEBUG_MODE === 'true' ? 'debug' : process.env.LOG_LEVEL,
  levels,
  silent: process.env.SILENT === 'true',
  format: buildFormat(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

const originalLogMethods = {
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  info: logger.info.bind(logger),
  http: logger.http.bind(logger),
  query: logger.query.bind(logger),
  debug: logger.debug.bind(logger),
};

logger.error = (message, data = null) => {
  if (process.env.LOG_ERRORS === 'true') {
    originalLogMethods.error(message, data);
  }
};

logger.warn = (message, data = null) => {
  originalLogMethods.warn(message, data);
};

logger.info = (message, data = null) => {
  originalLogMethods.info(message, data);
};

logger.http = (message, data = null) => {
  if (process.env.LOG_REQUESTS === 'true') {
    originalLogMethods.http(message, data);
  }
};

logger.query = (message, data = null) => {
  if (process.env.LOG_QUERIES === 'true') {
    originalLogMethods.query(message, data);
  }
};

logger.debug = (message, data = null) => {
  if (process.env.DEBUG_MODE === 'true') {
    originalLogMethods.debug(message, data);
  }
};

export default logger;
