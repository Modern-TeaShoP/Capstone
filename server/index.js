if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const PORT = process.env.PORT || 8080;
const app = express();
const socketio = require('socket.io');

const User = require('./db/models/User');

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const axios = require('axios');

const initializePassport = require('./auth/passport-config');
initializePassport(
  passport,
  async (email) => await axios.get(`/email/${email}`),
  async (id) => await axios.get(`/id/${id}`)
);

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  //Trying to get auth to work. Please.
  app.use(flash());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride('_method'));

  app.post(
    '/login',
    checkNotAuthenticated,
    passport.authenticate('local', {}),
    (req, res) => {
      res.send(req.user);
    }
  );

  app.post('/register', checkNotAuthenticated, async (req, res, next) => {
    try {
      res.status(201).send(await User.create(req.body));
    } catch (error) {
      next(error);
    }
  });

  app.get('/whoami', (req, res) => {
    if (req.user) {
      res.send(req.user);
    } else {
      res.send(null);
    }
  });

  app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
  });

  app.get('/test', (req, res) => {
    res.send({ hello: 'hello' });
  });

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
      //instead of redirect, send a status code saying they aren't logged in
    }
    next();
  }

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
  const io = socketio(server);
  require('./socket')(io);
};

async function bootApp() {
  await createApp();
  await startListening();
}

bootApp();
module.exports = app;
