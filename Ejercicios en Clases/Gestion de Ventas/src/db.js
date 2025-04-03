const { createConnection } = require("typeorm");
const { Cliente } = require("./entity/Clientes");
const { Producto } = require("./entity/Productos");
const { Factura } = require("./entity/Facturas");
const { DetalleFactura } = require("./entity/DetalleFacturas");


const connectDB = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST, 
      port: 3306,
      username: process.env.DB_USER, 
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Cliente, Producto, Factura, DetalleFactura], 
      synchronize: true, // Solo para desarrollo (crea automáticamente las tablas)
    });
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
