const express = require("express");
const router = express.Router();
const productoService = require("../service/productoService");

// Obtener todos los productos
router.get("/", (req, res) => {
  productoService.obtenerProductos(req, res);
});

// Obtener un producto por ID
router.get("/:id", (req, res) => {
  productoService.obtenerProductoPorId(req, res);
});

// Crear un nuevo producto
router.post("/", (req, res) => {
  productoService.crearProducto(req, res);
});

// Actualizar un producto
router.patch("/:id", (req, res) => {
  productoService.editarProducto(req, res);
});

// Eliminar un producto
router.delete("/:id", (req, res) => {
  productoService.eliminarProducto(req, res);
});

module.exports = router;