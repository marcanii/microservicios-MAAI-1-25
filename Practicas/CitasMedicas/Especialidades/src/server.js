const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('✅ Conectado a MongoDB')) // ✅ log en lugar de console.log
.catch(err => logger.error(`❌ Error conectando a MongoDB: ${err.message}`)); // ✅ log errores

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    logger.info(`🚀 Servidor listo en http://localhost:${PORT}${server.graphqlPath}`); // ✅ log en lugar de console.log
  });
}

startServer();
