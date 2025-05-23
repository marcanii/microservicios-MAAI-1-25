const { getRepository } = require("typeorm");
const { Cliente } = require("../entity/Clientes");

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const { page = 1, limit = 10, nombres, apellidos } = req.query;
    const skip = (page - 1) * limit;
    const query = getRepository(Cliente).createQueryBuilder("cliente")
      .leftJoinAndSelect("cliente.facturas", "factura")
      .leftJoinAndSelect("factura.detalles", "detalle")
      .leftJoinAndSelect("detalle.producto", "producto");
    
    if (nombres) {
      query.andWhere("cliente.nombres LIKE :nombres", { nombres: `%${nombres}%` });
    }
    if (apellidos) {
      query.andWhere("cliente.apellidos LIKE :apellidos", { apellidos: `%${apellidos}%` });
    }
    query.addOrderBy("cliente.apellidos", "ASC");
    const total = await query.getCount();
    const clientes = await query.skip(skip).take(limit).getMany();

    if (clientes.length > 0) {
      res.json({
        transaccion: true,
        mensaje: "Clientes encontrados",
        datos: clientes,
        paginacion: {
          pagina: Number(page),
          limite: Number(limit),
          total,
          paginas: Math.ceil(total / limit),
        },
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron clientes",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
};


// Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await getRepository(Cliente).findOne({
      where: { id: req.params.id },
      relations: ["facturas.detalles.producto"],
    });
    if (cliente) {
      res.json({
        transaccion: true,
        mensaje: "Cliente encontrado",
        datos: cliente,
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "Cliente no encontrado",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    const nuevoCliente = getRepository(Cliente).create({
      ci,
      nombres,
      apellidos,
      sexo,
    });
    const clienteCreado = await getRepository(Cliente).save(nuevoCliente);
    res.json({
      transaccion: true,
      mensaje: "Cliente creado",
      datos: clienteCreado,
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Editar un cliente
const editarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { ci, nombres, apellidos, sexo } = req.body;
    const cliente = await getRepository(Cliente).findOne({ where: { id } });
    if (!cliente) {
      return res.status(404).json({
        transaccion: false,
        mensaje: "Cliente no encontrado",
        datos: null,
      });
    }
    cliente.ci = ci;
    cliente.nombres = nombres;
    cliente.apellidos = apellidos;
    cliente.sexo = sexo;
    const clienteActualizado = await getRepository(Cliente).save(cliente);
    res.json({
      transaccion: true,
      mensaje: "Cliente actualizado",
      datos: clienteActualizado,
    });
  } catch (error) {
    console.error("Error al editar cliente:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const cliente = await getRepository(Cliente).findOne({
      where: { id: req.params.id },
    });
    if (!cliente) {
      return res.status(404).json({
        transaccion: false,
        mensaje: "Cliente no encontrado",
        datos: null,
      });
    }
    const r = await getRepository(Cliente).remove(cliente);
    res.json({
      transaccion: true,
      mensaje: "Cliente eliminado",
      datos: r,
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  editarCliente,
  eliminarCliente,
};