const { sequelize } = require("../models");
const logger = require("../utils/logger.utils");

/**
 * check to see if there is any problem
 * with the sequelize or database connection
 */
exports.dbConnect = async () => {
  try {
    await sequelize.authenticate();

    logger.info("Connected to database");
  } catch (error) {
    throw logger.error("Unable to connect to database", error);
  }
};
