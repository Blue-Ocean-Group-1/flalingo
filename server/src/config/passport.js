import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { User } from '../models/user.model.js';

const configurePassport = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
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
