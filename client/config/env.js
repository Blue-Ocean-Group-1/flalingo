// src/config/env.js
const requireEnvVar = (name) => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const validateApiUrl = (url) => {
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw new Error(`Invalid API URL: ${url}`);
  }
};

const validateLogLevel = (level) => {
  const validLevels = ['error', 'warn', 'info', 'debug'];
  return validLevels.includes(level) ? level : 'info';
};

export const validateEnv = () => {
  try {
    requireEnvVar('VITE_API_URL');
    validateApiUrl(import.meta.env.VITE_API_URL);
  } catch (error) {
    console.error('Environment validation failed:', error.message);
    throw error;
  }
};

export const env = {
  // API
  API_URL: validateApiUrl(requireEnvVar('VITE_API_URL')),
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),

  // App Settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'PolyGlot',

  // Logging
  LOG_LEVEL: validateLogLevel(import.meta.env.VITE_LOG_LEVEL),
  DEBUG_MODE: import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true',
  LOG_REQUESTS: import.meta.env.VITE_LOG_REQUESTS !== 'false',
  LOG_ERRORS: import.meta.env.VITE_LOG_ERRORS !== 'false',
  SILENT: import.meta.env.VITE_SILENT === 'true',

  // Features
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',

  // Environment
  NODE_ENV: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
};

// Example .env file values
const envExample = {
  VITE_API_URL: 'http://localhost:3000/api',
  VITE_API_TIMEOUT: '10000',
  VITE_APP_NAME: 'PolyGlot',
  VITE_LOG_LEVEL: 'debug',
  VITE_DEBUG_MODE: 'true',
  VITE_LOG_REQUESTS: 'true',
  VITE_LOG_ERRORS: 'true',
  VITE_SILENT: 'false',
  VITE_MOCK_API: 'false',
};

if (env.isDevelopment) {
  console.group('Environment Configuration');
  console.log('API URL:', env.API_URL);
  console.log('Debug Mode:', env.DEBUG_MODE);
  console.log('Log Level:', env.LOG_LEVEL);
  console.log('Environment:', env.NODE_ENV);
  console.groupEnd();

  console.group('Environment Variables Example');
  console.log(envExample);
  console.groupEnd();
}

validateEnv();
