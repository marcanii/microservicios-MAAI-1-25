const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Productos");

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await getRepository(Producto).find();
    if (productos.length > 0) {
      res.json({
        transaccion: true,
        mensaje: "Productos encontrados",
        datos: productos,
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron productos",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await getRepository(Producto).findOne({
      where: { id: req.params.id },
    });
    if (producto) {
      res.json({
        transaccion: true,
        mensaje: "Producto encontrado",
        datos: producto,
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "Producto no encontrado",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    const nuevoProducto = getRepository(Producto).create({
      nombre,
      descripcion,
      marca,
      stock,
    });
    const resultado = await getRepository(Producto).save(nuevoProducto);
    res.json({
      transaccion: true,
      mensaje: "Producto creado exitosamente",
      datos: resultado,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Actualizar un producto
const editarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    const producto = await getRepository(Producto).findOne({
      where: { id: req.params.id },
    });
    if (producto) {
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.marca = marca;
      producto.stock = stock;
      const resultado = await getRepository(Producto).save(producto);
      res.json({
        transccion: true,
        mensaje: "Producto editado exitosamente",
        datos: resultado,
      });
    } else {
      res.status(404).json({
        transaccion: false,
        mensaje: "Producto no encontrado",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "ID de producto no proporcionado" });
    }
    const producto = await getRepository(Producto).findOne({
      where: { id: req.params.id },
    });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (producto.stock > 0) {
      return res
        .status(400)
        .json({ error: "No se puede eliminar un producto con stock" });
    }
    const resultado = await getRepository(Producto).remove(producto);
    res.json({
      transaccion: true,
      mensaje: "Producto eliminado exitosamente",
      datos: resultado,
    });
  } catch (error) {
    console.error("Error al editar producto:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error,
      datos: null,
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
