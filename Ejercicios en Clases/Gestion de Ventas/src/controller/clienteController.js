const express = require("express");
const router = express.Router();
const clienteService = require("../service/clienteService");

// Obtener todos los clientes
router.get("/", (req, res) => {
  clienteService.obtenerClientes(req, res);
});

// Obtener un cliente por ID
router.get("/:id", (req, res) => {
  clienteService.obtenerClientePorId(req, res);
});

// Crear un nuevo cliente
router.post("/", (req, res) => {
  clienteService.crearCliente(req, res);
});

// Actualizar un cliente
router.patch("/:id", (req, res) => {
  clienteService.editarCliente(req, res);
});

// Eliminar un cliente
router.delete("/:id", (req, res) => {
  clienteService.eliminarCliente(req, res);
});

module.exports = router;