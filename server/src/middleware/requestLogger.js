import { performance } from 'node:perf_hooks';

import chalk from 'chalk';

import logger from '../config/logger.js';

const formatRequestLog = (req, res, duration) => `
${chalk.blue('━━━━━━━━━━ REQUEST ━━━━━━━━━━')}
${chalk.cyan.bold('METHOD:')}   ${chalk.green(req.method)}
${chalk.cyan.bold('PATH:')}     ${chalk.white(req.url)}
${chalk.cyan.bold('STATUS:')}   ${chalk.green(res.statusCode)}
${chalk.cyan.bold('TOTAL:')}    ${chalk.yellow(duration.toFixed(3) + ' ms')}
${chalk.cyan.bold('IP:')}       ${chalk.white(req.ip)}
${chalk.cyan.bold('AGENT:')}    ${chalk.gray(req.get('user-agent'))}
${chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━')}`;

export const requestLogger = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    if (res.statusCode < 400) {
      const duration = performance.now() - start;
      const formattedLog = formatRequestLog(req, res, duration);
      logger.http(formattedLog);
    }
  });

  next();
};
