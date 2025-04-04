const { getRepository } = require("typeorm");
const { DetalleFactura } = require("../entity/DetalleFacturas");

// obtener todos los detalles factura
const getAllDetallesFactura = async (req, res) => {
  try {
    const { page = 1, limit = 10, producto } = req.query;
    const skip = (page - 1) * limit;
    const query = getRepository(DetalleFactura).createQueryBuilder("detalleFactura")
      .leftJoinAndSelect("detalleFactura.factura", "factura")
      .leftJoinAndSelect("detalleFactura.producto", "producto");
    if (producto) {
      query.andWhere("producto.nombre LIKE :producto", { producto: `%${producto}%` });
    }
    query.addOrderBy("detalleFactura.id", "ASC");
    const totalCount = await query.getCount();
    const detallesFactura = await query.skip(skip).take(limit).getMany();
    if (detallesFactura.length > 0) {
      res.json({
        transaccion: true,
        mensaje: "Detalles de factura encontrados",
        datos: detallesFactura,
        paginacion: {
          pagina: Number(page),
          limite: Number(limit),
          total: totalCount,
          paginas: Math.ceil(totalCount / limit),
        },
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron detalles de factura",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener detalles de factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// obtener un detalle factura por id
const getDetalleFacturaById = async (req, res) => {
  try {
    const detalleFactura = await getRepository(DetalleFactura).findOne({
      where: { id: req.params.id },
      relations: ["factura", "producto"],
    });
    if (detalleFactura) {
      res.json({
        transaccion: true,
        mensaje: "Detalle de factura encontrado",
        datos: detalleFactura,
      });
    }
    else {
      res.status(404).json({
        transaccion: false,
        mensaje: "Detalle de factura no encontrado",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener detalle de factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
}

// crear un nuevo detalle factura
const crearDetalleFactura = async (req, res) => {
  try {
    const { cantidades, precios, producto_id, factura_id } = req.body;
    const nuevoDetalleFactura = getRepository(DetalleFactura).create({
      cantidades,
      precios,
      producto: { id: producto_id },
      factura: { id: factura_id },
    });
    await getRepository(DetalleFactura).save(nuevoDetalleFactura);
    res.json({
      transaccion: true,
      mensaje: "Detalle de factura creado",
      datos: nuevoDetalleFactura,
    });
  } catch (error) {
    console.error("Error al crear detalle de factura:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
}

// editar un detalle factura
const editarDetalleFactura = async (req, res) => {
  try {
    const { cantidades, precios, producto_id, factura_id } = req.body;
    const detalleFactura = await getRepository(DetalleFactura).findOne({
      where: { id: req.params.id },
    });
    if (!detalleFactura) {
      return res.status(404).json({
        transaccion: false,
        mensaje: "Detalle de factura no encontrado",
        datos: null,
      });
    }
    detalleFactura.cantidades = cantidades;
    detalleFactura.precios = precios;
    detalleFactura.producto = { id: producto_id };
    detalleFactura.factura = { id: factura_id };
    const detalleFacturaActualizado = await getRepository(DetalleFactura).save(detalleFactura);
    res.json({
      transaccion: true,
      mensaje: "Detalle de factura actualizado",
      datos: detalleFacturaActualizado,
    });
  } catch (error) {
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
}

// eliminar un detalle factura
const eliminarDetalleFactura = async (req, res) => {
  try {
    const detalleFactura = await getRepository(DetalleFactura).findOne({
      where: { id: req.params.id },
    });
    if (!detalleFactura) {
      return res.status(404).json({
        transaccion: false,
        mensaje: "Detalle de factura no encontrado",
        datos: null,
      });
    }
    await getRepository(DetalleFactura).remove(detalleFactura);
    res.json({
      transaccion: true,
      mensaje: "Detalle de factura eliminado",
      datos: detalleFactura,
    });
  } catch (error) {
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
}

module.exports = {
  getAllDetallesFactura,
  getDetalleFacturaById,
  crearDetalleFactura,
  editarDetalleFactura,
  eliminarDetalleFactura,
};