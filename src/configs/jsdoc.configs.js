const swaggerJsdoc = require("swagger-jsdoc");

const swaggerConfig = require("./swagger.configs");

const options = {
  definition: {
    ...swaggerConfig,
  },
  apis: ["./src/routes/*.route.js"], // files containing annotations
};

module.exports = swaggerJsdoc(options);
