// src/config/logger.js
import { env } from './env';

/* eslint-disable no-unused-vars */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};
/* eslint-enable no-unused-vars */

const colors = {
  error: '#FF5252', // Red
  warn: '#FFC107', // Amber
  info: '#4CAF50', // Green
  debug: '#9E9E9E', // Gray
};

const formatMessage = (level, message, data = null) => {
  const color = colors[level];

  const style = [
    `color: ${color}`,
    'font-weight: bold',
    'padding: 2px 4px',
    'border-radius: 2px',
  ].join(';');

  if (data) {
    console.groupCollapsed(
      `%c${level.toUpperCase()}:%c ${message}`,
      style,
      'color: inherit',
    );
    console.log(data);
    console.groupEnd();
  } else {
    console.log(
      `%c${level.toUpperCase()}:%c ${message}`,
      style,
      'color: inherit',
    );
  }
};

class ClientLogger {
  info(message, data = null) {
    formatMessage('info', message, data);
  }

  warn(message, data = null) {
    formatMessage('warn', message, data);
  }

  error(message, data = null) {
    formatMessage('error', message, data);
  }

  debug(message, data = null) {
    if (env.DEBUG_MODE) {
      formatMessage('debug', message, data);
    }
  }
}

const logger = new ClientLogger();

if (env.isDevelopment) {
  window.logger = logger;
}

export default logger;
