const path = require("path");
const { format, createLogger, transports } = require("winston");

const vars = require("../configs/vars.configs");

const loggers = {
  development: () => {
    const logFormat = format.printf(
      ({ level, message, timestamp, stack }) =>
        `${timestamp} ${level}: ${stack || message}`
    );

    return createLogger({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        logFormat
      ),
      transports: [new transports.Console()],
    });
  },
  production: () =>
    createLogger({
      level: "info",
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.prettyPrint()
      ),
      // defaultMeta: { service: 'user-service' },
      transports: [
        new transports.Console(),
        new transports.File({
          filename: path.join(__dirname, "..", "logs", "error.log"),
          level: "error",
        }),
        new transports.File({
          filename: path.join(__dirname, "..", "logs", "combined.log"),
        }),
      ],
    }),
};

logger = loggers[vars.env]();

module.exports = logger;
