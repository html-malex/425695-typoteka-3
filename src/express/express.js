'use strict';
const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('../service/lib/sequelize');

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is not defined');
}
const {DEFAULT_SERVER_PORT, Dir, HttpCode} = require('./constants');
const {articlesRoutes, categoriesRoutes, mainRoutes, myRoutes} = require('./routes');

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));
app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));

app.set('views', path.resolve(__dirname, 'templates'));
app.set('view engine', 'pug');


app.use('/', mainRoutes);
app.use('/articles', articlesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/my', myRoutes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render('errors/400');
});
app.use((err, req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render('errors/500');
});

app.listen(DEFAULT_SERVER_PORT);
