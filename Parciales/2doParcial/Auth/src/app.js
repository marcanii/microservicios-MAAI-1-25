require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const usuarioController = require("./controller/usuarioController");
const swaggerDocs = require("./swagger");

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
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
  });
});