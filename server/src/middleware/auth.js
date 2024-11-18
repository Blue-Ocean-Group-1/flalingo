import passport from 'passport';

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      email: user.email,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
export const sessionConfig = {
  secret: 'MNVRGDuv74tCXWxtWP$exL7Afw*Wzug4Ks8%^djQE!Ek$B%p$%oSEaK#cWZe8@uJ',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
};
