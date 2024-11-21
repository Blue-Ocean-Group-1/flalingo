import { env } from './env.js';
export const emailJsConfig = {
  publicKey: env.EMAIL_JS_PUBLIC_KEY,
  limitRate: {
    id: 'app',
    throttle: 10000,
  },
  limitRatePerUser: {
    id: 'user',
    throttle: 10000,
    watchVariable: 'userEmail',
  },
};
