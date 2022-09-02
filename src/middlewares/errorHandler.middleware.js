/**
 * error handlers
 */
exports.errorHandler = (error, req, res, next) => {
  logger.error(`[${error.name}] ${error.message}`);
  // logger.error(error);
  return res.status(error.status || 500).json({ msg: error.message });
};
