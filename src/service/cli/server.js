'use strict';

const express = require('express');

const app = express();
const {getLogger} = require('../lib/logger');
const sequelize = require('../lib/sequelize');

const routes = require('../api');
const {API_PREFIX, DEFAULT_PORT, ExitCode, HttpCode} = require('../constants');


module.exports = {
  name: '--server',
  async run(args) {
    const logger = getLogger({name: 'api'});

    try {
      logger.info('Trying to connect to database...');
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info('Connection to database established');

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;


    app.use(express.json());

    app.use(API_PREFIX, routes);

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send('Not found');
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on('finish', () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
  }
};
