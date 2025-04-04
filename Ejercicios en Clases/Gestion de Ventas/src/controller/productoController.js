const express = require("express");
const router = express.Router();
const productoService = require("../service/productoService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *         - marca
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del producto (autogenerado).
 *         nombre:
 *           type: string
 *           description: Nombre del producto. Es único y no puede ser nulo.
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto.
 *         marca:
 *           type: string
 *           description: Marca del producto.
 *         stock:
 *           type: integer
 *           description: Cantidad en inventario del producto. Valor predeterminado es 0.
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetalleFactura'
 *           description: Detalles de las facturas asociadas al producto.
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Devuelve una lista de todos los productos disponibles.
 *     responses:
 *       200:
 *         description: Lista de productos encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       404:
 *         description: No se encontraron productos.
 */
router.get("/", (req, res) => {
  productoService.obtenerProductos(req, res);
});

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Devuelve el producto con el ID especificado.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del producto a obtener.
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado.
 */
router.get("/:id", (req, res) => {
  productoService.obtenerProductoPorId(req, res);
});

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       400:
 *         description: Datos inválidos para crear el producto.
 */
router.post("/", (req, res) => {
  productoService.crearProducto(req, res);
});

/**
 * @swagger
 * /productos/{id}:
 *   patch:
 *     summary: Actualizar un producto
 *     description: Actualiza la información de un producto existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del producto a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       404:
 *         description: Producto no encontrado.
 */
router.patch("/:id", (req, res) => {
  productoService.editarProducto(req, res);
});

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     description: Elimina un producto del sistema por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del producto a eliminar.
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 *       404:
 *         description: Producto no encontrado.
 */
router.delete("/:id", (req, res) => {
  productoService.eliminarProducto(req, res);
});

module.exports = router;