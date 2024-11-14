import chalk from 'chalk';

import logger from '../config/logger.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const formatErrorLog = (err, req) => {
  const stackLine = err.stack.split('\n')[1].trim();

  return `
${chalk.red('━━━━━━━━━━ ERROR ━━━━━━━━━━')}
${chalk.bold('TYPE:')}     ${err.name}
${chalk.bold('MESSAGE:')}  ${err.message}
${chalk.bold('STATUS:')}   ${err.statusCode}
${chalk.bold('PATH:')}     ${req.method} ${req.url}
${chalk.bold('ORIGIN:')}   ${stackLine}

${chalk.bold('REQUEST DETAILS:')}
• ${chalk.bold('IP:')}      ${req.ip}
• ${chalk.bold('Agent:')}   ${req.get('user-agent')}

${chalk.bold('REQUEST DATA:')}
${chalk.bold('Params:')}  ${JSON.stringify(req.params, null, 2)}

${chalk.bold('Query:')}   ${JSON.stringify(req.query, null, 2)}

${chalk.bold('Body:')}    ${JSON.stringify(req.body, null, 2)}

${chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━')}`;
};

export const errorLogger = (err, req, res, next) => {
  const formattedError = formatErrorLog(err, req);

  if (err.statusCode >= 500) {
    logger.error(formattedError);
  } else if (err.statusCode >= 400) {
    logger.warn(formattedError);
  } else {
    logger.error(formattedError);
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
  });
  next();
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
