const { createConnection } = require("typeorm");
const { Notificacion } = require("./entities/Notificacion");
require("dotenv").config(); // Cargar variables de entorno desde .env
const logger = require('./utils/logger');

const connectDB = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST, 
      port: process.env.DB_PORT || 3306,
      username: process.env.DB_USER, 
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Notificacion], 
      synchronize: true,
    });
    logger.info("✅ Conexión a la base de datos establecida correctamente");
  } catch (error) {
    logger.error(`❌ Error al conectar a la base de datos: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
