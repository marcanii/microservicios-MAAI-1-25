require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const productoController = require("./controller/productoController");
const clienteController = require("./controller/clienteController");
const facturaController = require("./controller/facturaController");
const detalleFacturaController = require("./controller/detalleFacturaController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/productos", productoController);
app.use("/clientes", clienteController);
app.use("/facturas", facturaController);
app.use("/detalles-facturas", detalleFacturaController);
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
});
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});