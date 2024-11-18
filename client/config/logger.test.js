import logger from './logger';
import { env } from './env';
import { beforeAll, afterEach, describe, it, expect, vi } from 'vitest';

describe('ClientLogger', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...env };
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.assign(env, originalEnv);
  });

  it('should log info messages', () => {
    console.log = vi.fn();
    logger.info('Info message');
    expect(console.log).toHaveBeenCalledWith(
      '%cINFO:%c Info message',
      'color: #4CAF50;font-weight: bold;padding: 2px 4px;border-radius: 2px',
      'color: inherit',
    );
  });

  it('should log warn messages', () => {
    console.log = vi.fn();
    logger.warn('Warn message');
    expect(console.log).toHaveBeenCalledWith(
      '%cWARN:%c Warn message',
      'color: #FFC107;font-weight: bold;padding: 2px 4px;border-radius: 2px',
      'color: inherit',
    );
  });

  it('should log error messages', () => {
    console.log = vi.fn();
    logger.error('Error message');
    expect(console.log).toHaveBeenCalledWith(
      '%cERROR:%c Error message',
      'color: #FF5252;font-weight: bold;padding: 2px 4px;border-radius: 2px',
      'color: inherit',
    );
  });

  it('should log debug messages when DEBUG_MODE is true', () => {
    env.DEBUG_MODE = true;
    console.log = vi.fn();
    logger.debug('Debug message'); // eslint-disable-line
    expect(console.log).toHaveBeenCalledWith(
      '%cDEBUG:%c Debug message',
      'color: #9E9E9E;font-weight: bold;padding: 2px 4px;border-radius: 2px',
      'color: inherit',
    );
  });

  it('should not log debug messages when DEBUG_MODE is false', () => {
    env.DEBUG_MODE = false;
    console.log = vi.fn();
    logger.debug('Debug message'); // eslint-disable-line
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should log messages with data', () => {
    console.groupCollapsed = vi.fn();
    console.log = vi.fn();
    console.groupEnd = vi.fn();
    const data = { key: 'value' };
    logger.info('Info message with data', data);
    expect(console.groupCollapsed).toHaveBeenCalledWith(
      '%cINFO:%c Info message with data',
      'color: #4CAF50;font-weight: bold;padding: 2px 4px;border-radius: 2px',
      'color: inherit',
    );
    expect(console.log).toHaveBeenCalledWith(data);
    expect(console.groupEnd).toHaveBeenCalled();
  });
});
