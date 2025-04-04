const express = require("express");
const router = express.Router();
const detalleFacturaService = require("../service/detalleFacturaService");

// Obtener todos los detalles de factura
router.get("/", async (req, res) => {
  detalleFacturaService.getAllDetallesFactura(req, res);
});

// Obtener un detalle de factura por ID
router.get("/:id", async (req, res) => {
  detalleFacturaService.getDetalleFacturaById(req, res);
});

// Crear un nuevo detalle de factura
router.post("/", async (req, res) => {
  detalleFacturaService.crearDetalleFactura(req, res);
});

// Actualizar un detalle de factura
router.patch("/:id", async (req, res) => {
  detalleFacturaService.editarDetalleFactura(req, res);
});

// Eliminar un detalle de factura
router.delete("/:id", async (req, res) => {
  detalleFacturaService.eliminarDetalleFactura(req, res);
});

module.exports = router;