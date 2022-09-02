const vars = require("./vars.configs");
const logger = require("../utils/logger.utils");

module.exports = {
  development: {
    username: vars.db.username,
    password: vars.db.password,
    database: vars.db.database,
    host: vars.db.host,
    dialect: vars.db.dialect,
    pool: {
      max: 20,
      min: 0,
      idle: 5000,
    },
    logging: (message) => logger.info(`Sequelize: ${message}`),
  },
  production: {
    username: vars.db.username,
    password: vars.db.password,
    database: vars.db.database,
    host: vars.db.host,
    dialect: vars.db.dialect,
    pool: {
      max: 20,
      min: 0,
      idle: 5000,
    },
    logging: false,
  },
};
