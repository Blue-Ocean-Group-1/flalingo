import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { User } from '../models/user.model.js';

import { env } from './env.js';

const configurePassport = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => done(err, false));
    }),
  );
};

export default configurePassport;
