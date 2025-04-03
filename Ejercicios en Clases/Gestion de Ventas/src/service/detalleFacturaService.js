const { getRepository } = require("typeorm");
const { DetalleFactura } = require("../entity/DetalleFacturas");

// Obtener todos los detalles de factura
const obtenerDetallesFactura = async (req, res) => {
  const detallesFactura = await getRepository(DetalleFactura).find();
  res.json(detallesFactura);
};