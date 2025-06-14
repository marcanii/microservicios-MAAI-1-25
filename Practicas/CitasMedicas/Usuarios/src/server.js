require("dotenv").config();
const express = require("express");
const connectDB = require("./bd");
const usuarioController = require("./controller/usuarioController");
const swaggerDocs = require("./swagger");
const logger = require('./utils/logger');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/usuarios", usuarioController);
// Configuración de Swagger
swaggerDocs(app);

app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
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