const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mi API con Swagger",
      version: "1.0.0",
      description: "Documentación de mi API usando Swagger en Node.js",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Servidor local",
      },
    ],
  },
  apis: [path.join(__dirname, 'controller', '*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
