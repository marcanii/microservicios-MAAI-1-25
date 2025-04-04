const { getRepository } = require("typeorm");
const { Factura } = require("../entity/Facturas");

// obtener todas las facturas
const getAllFacturas = async (req, res) => {
  try {
    const facturas = await getRepository(Factura).find({
      relations: ["cliente", "detalles"],
    });
    if (facturas.length > 0) {
      res.json({
        transaccion: true,
        mensaje: "Facturas encontradas",
        datos: facturas,
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron facturas",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// obtener una factura por id
const getFacturaById = async (req, res) => {
  try {
    const factura = await getRepository(Factura).findOne({
      where: { id: req.params.id },
      relations: ["cliente", "detalles"],
    });
    if (factura) {
      res.json({
        transaccion: true,
        mensaje: "Factura encontrada",
        datos: factura,
      });
    }
    else {
      res.status(404).json({
        transaccion: false,
        mensaje: "Factura no encontrada",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
}

// get factura by cliente id
const getFacturaByClienteId = async (req, res) => {
  try {
    const facturas = await getRepository(Factura).find({
      where: { cliente_id: req.params.clienteId },
      relations: ["cliente", "detalles"],
    });
    if (facturas.length > 0) {
      res.json({
        transaccion: true,
        mensaje: "Facturas encontradas",
        datos: facturas,
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron facturas",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// crear una nueva factura
const createFactura = async (req, res) => {
  try {
    const { cliente_id, fecha } = req.body;
    const nuevaFactura = getRepository(Factura).create({
      cliente: { id: cliente_id },
      fecha: fecha || new Date(),
    });
    const savedFactura = await getRepository(Factura).save(nuevaFactura);
    res.status(201).json({
      transaccion: true,
      mensaje: "Factura creada",
      datos: savedFactura,
    });
  } catch (error) {
    console.error("Error al crear factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// editar una factura
const editFactura = async (req, res) => {
  try {
    const { cliente_id, fecha } = req.body;
    const factura = await getRepository(Factura).findOne({
      where: { id: req.params.id },
      relations: ["cliente", "detalles"],
    });
    if (!factura) {
      return res.status(404).json({
        transaccion: false,
        mensaje: "Factura no encontrada",
        datos: null,
      });
    }
    factura.cliente = { id: cliente_id };
    factura.fecha = fecha || new Date();
    const updatedFactura = await getRepository(Factura).save(factura);
    res.json({
      transaccion: true,
      mensaje: "Factura actualizada",
      datos: updatedFactura,
    });
  } catch (error) {
    console.error("Error al editar factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// eliminar una factura
const deleteFactura = async (req, res) => {
  try {
    const factura = await getRepository(Factura).findOne({
      where: { id: req.params.id },
      relations: ["cliente", "detalles"],
    });
    if (!factura) {
      return res.status(404).json({
        transaccion: false,
        mensaje: "Factura no encontrada",
        datos: null,
      });
    }
    const r = await getRepository(Factura).remove(factura);
    res.json({
      transaccion: true,
      mensaje: "Factura eliminada",
      datos: r,
    });
  } catch (error) {
    console.error("Error al eliminar factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

module.exports = {
  getAllFacturas,
  getFacturaById,
  getFacturaByClienteId,
  createFactura,
  editFactura,
  deleteFactura,
};