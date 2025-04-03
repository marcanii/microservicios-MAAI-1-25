const { getRepository } = require("typeorm");
const { Cliente } = require("../entity/Clientes");

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  const clientes = await getRepository(Cliente).findMany();
  res.json(clientes);
};

// Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  const cliente = await getRepository(Cliente).findOne(req.params.id);
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ mensaje: "Cliente no encontrado" });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const nuevoCliente = getRepository(Cliente).create({
    nombre,
    correo,
    telefono,
  });
  const resultado = await getRepository(Cliente).save(nuevoCliente);
  res.json(resultado);
};

// Actualizar un cliente
const editarCliente = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const cliente = await getRepository(Cliente).findOne(req.params.id);
  if (cliente) {
    cliente.nombre = nombre;
    cliente.correo = correo;
    cliente.telefono = telefono;
    const resultado = await getRepository(Cliente).save(cliente);
    res.json(resultado);
  } else {
    res.status(404).json({ mensaje: "Cliente no encontrado" });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  const resultado = await getRepository(Cliente).delete(req.params.id);
  res.json(resultado);
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  editarCliente,
  eliminarCliente,
};