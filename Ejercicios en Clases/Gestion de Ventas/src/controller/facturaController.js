const express = require("express");
const router = express.Router();
const facturaService = require("../service/facturaService");

// Obtener todas las facturas
router.get("/", (req, res) => {
  facturaService.getAllFacturas(req, res);
});

// Obtener una factura por ID
router.get("/:id", (req, res) => {
  facturaService.getFacturaById(req, res);
});

// Obtener una factura por ID de cliente
router.get("/cliente/:id", (req, res) => {
  facturaService.getFacturaByClienteId(req, res);
});

// Crear una nueva factura
router.post("/", (req, res) => {
  facturaService.createFactura(req, res);
});

// Actualizar una factura
router.patch("/:id", (req, res) => {
  facturaService.editFactura(req, res);
});

// Eliminar una factura
router.delete("/:id", (req, res) => {
  facturaService.deleteFactura(req, res);
});

module.exports = router;
