const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");

const vars = require("./configs/vars.configs");
const morgan = require("./middlewares/morgan.middlewares");
const logger = require("./utils/logger.utils");
const routes = require("./routes");
const swaggerDocument = require("./configs/jsdoc.configs");
const { NotFoundError } = require("./utils/exceptions.utils");
const initTask = require("./init_app");
const { errorHandler } = require("./middlewares/errorHandler.middleware");

dotenv.config();

const appInit = async () => {
  try {
    const app = express();

    /**
     * middlewares
     */

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(helmet());
    app.use(compression());
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);

    app.use("/static", express.static("public/static"));

    /**
     * initial application
     */

    await initTask();

    /**
     * routes
     */

    app.use("/api", routes);
    app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use((req, res, next) => {
      try {
        throw new NotFoundError("route not found");
      } catch (error) {
        next(error);
      }
    });

    app.use(errorHandler); // error handler

    const unexpectedErrorHandler = (error) => {
      logger.error(error);
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
    });

    /**
     * app listen
     */

    app.listen(vars.port, () => {
      logger.info(`Server is running on port: ${vars.port}`);
    });
  } catch (error) {
    logger.error("something went wrong\n", error);
  }
};

appInit();
