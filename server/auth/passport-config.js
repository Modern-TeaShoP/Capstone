const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../db/models/User');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const foundUser = await User.findOne({ where: { email: email } });
    // console.log(foundUser, '**********'); We should do something globally with this to load in the future
    if (password === foundUser.password) {
      return done(null, foundUser);
    } else {
      return done(null, false);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    return done(null, await User.findByPk(id));
  });
}

module.exports = initialize;
