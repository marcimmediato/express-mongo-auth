const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const keys = require('../config/keys');
const User = mongoose.model('user');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

module.exports = app => {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there ' });
  });

  app.post('/signin', requireSignin, async ({ user }, res) => {
    res.send({ token: tokenForUser(user) });
  });

  app.post('/signup', async ({ body: { email, password } }, res) => {
    if (!email || !password) {
      return res
        .status(422)
        .send({ error: 'You must provide an email and password.' });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const newUser = await new User({
      email,
      password
    }).save();

    res.json({ token: tokenForUser(newUser) });
  });
};
