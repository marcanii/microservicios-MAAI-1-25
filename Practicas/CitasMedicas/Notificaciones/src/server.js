require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const notificacionController = require("./controllers/notificacionController");
const swaggerDocs = require("./swagger");
const logger = require('./utils/logger');
const app = express();
const { startRabbitListener } = require("./rabbitmq/listener");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/notificaciones", notificacionController);
// Configuración de Swagger
swaggerDocs(app);

app.use("/", (req, res) => {
  res.send("Bienvenido al servicio de notificaciones!");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor listo en http://localhost:${PORT}`);
    logger.info(`📚 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
  }
  ).on('error', (err) => {
    logger.error(`❌ Error al iniciar el servidor: ${err.message}`);
  });
});

// Escuchar eventos desde RabbitMQ
startRabbitListener().catch(console.error);