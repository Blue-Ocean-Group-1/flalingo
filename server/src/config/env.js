import logger from './logger.js';
const requireEnvVar = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const validatePort = (port) => {
  const numPort = parseInt(port, 10);
  if (isNaN(numPort) || numPort < 0 || numPort > 65535) {
    throw new Error(`Invalid port number: ${port}`);
  }
  return numPort;
};

const validateMongoUri = (uri) => {
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(`Invalid MongoDB URI: ${uri}`);
  }
  return uri;
};

const validateNodeEnv = (env) => {
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(env)) {
    throw new Error(
      `Invalid NODE_ENV: ${env}. Must be one of: ${validEnvs.join(', ')}`,
    );
  }
  return env;
};

const validateLogLevel = (level) => {
  const validLevels = ['error', 'warn', 'info', 'http', 'query', 'debug'];
  if (!validLevels.includes(level)) {
    throw new Error(
      `Invalid LOG_LEVEL: ${level}. Must be one of: ${validLevels.join(', ')}`,
    );
  }
  return level;
};

export const validateEnv = () => {
  try {
    requireEnvVar('MONGODB_URI');
    requireEnvVar('CORS_ORIGIN');
    validatePort(process.env.PORT || '3000');
    validateMongoUri(process.env.MONGODB_URI);
    validateNodeEnv(process.env.NODE_ENV || 'development');
    validateLogLevel(process.env.LOG_LEVEL || 'info');
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

export const env = {
  // App
  NODE_ENV: validateNodeEnv(process.env.NODE_ENV || 'development'),
  PORT: validatePort(process.env.PORT || '5000'),

  // Database
  MONGODB_URI: validateMongoUri(requireEnvVar('MONGODB_URI')),
  MONGODB_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },

  // Logging
  LOG_LEVEL: validateLogLevel(process.env.LOG_LEVEL || 'info'),
  LOG_REQUESTS: process.env.LOG_REQUESTS !== 'false',
  LOG_ERRORS: process.env.LOG_ERRORS !== 'false',
  LOG_QUERIES: process.env.LOG_QUERIES === 'true',
  SILENT: process.env.SILENT === 'true',
  PRETTY_LOGGING: process.env.PRETTY_LOGGING !== 'false',
  LOG_TIMESTAMPS: process.env.LOG_TIMESTAMPS !== 'false',

  // Security
  CORS_ORIGIN: requireEnvVar('CORS_ORIGIN'),

  // Debug
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  STACK_TRACE: process.env.STACK_TRACE === 'true',
  VERBOSE: process.env.VERBOSE === 'true',

  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

if (env.isDevelopment) {
  env.LOG_QUERIES = env.LOG_QUERIES ?? true;
  env.LOG_DB_OPERATIONS = env.LOG_DB_OPERATIONS ?? true;
  env.DEBUG_MODE = env.DEBUG_MODE ?? true;
  env.STACK_TRACE = env.STACK_TRACE ?? true;
  env.VERBOSE = env.VERBOSE ?? true;
}

if (env.isProduction) {
  env.LOG_QUERIES = env.LOG_QUERIES ?? false;
  env.LOG_DB_OPERATIONS = env.LOG_DB_OPERATIONS ?? false;
  env.DEBUG_MODE = false;
  env.STACK_TRACE = false;
  env.VERBOSE = false;
}

if (!env.SILENT && env.isDevelopment) {
  /* eslint-disable */
  console.info('✔︎ Environment variables validated successfully');

  if (env.VERBOSE) {
    console.debug('Current configuration:', {
      NODE_ENV: env.NODE_ENV,
      LOG_LEVEL: env.LOG_LEVEL,
      LOG_REQUESTS: env.LOG_REQUESTS,
      LOG_QUERIES: env.LOG_QUERIES,
      DEBUG_MODE: env.DEBUG_MODE,
    });
  }
  /* eslint-enable */
}
