const express = require("express");
const router = express.Router();
const detalleFacturaService = require("../service/detalleFacturaService");

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleFactura:
 *       type: object
 *       required:
 *         - cantidades
 *         - precios
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del detalle de factura (autogenerado).
 *         cantidades:
 *           type: integer
 *           description: Cantidad del producto en el detalle de factura.
 *         precios:
 *           type: number
 *           format: decimal
 *           description: Precio del producto en el detalle de factura.
 *         producto:
 *           type: object
 *           description: Producto asociado al detalle de factura.
 *           properties:
 *             id:
 *               type: integer
 *               description: ID del producto.
 *             nombre:
 *               type: string
 *               description: Nombre del producto.
 *         factura:
 *           type: object
 *           description: Factura asociada al detalle de factura.
 *           properties:
 *             id:
 *               type: integer
 *               description: ID de la factura.
 *             fecha:
 *               type: string
 *               format: date
 *               description: Fecha de la factura.
 */

/**
 * @swagger
 * /detalles-facturas:
 *   get:
 *     summary: Obtener todos los detalles de factura
 *     description: Devuelve una lista de todos los detalles de factura en el sistema.
 *     responses:
 *       200:
 *         description: Lista de detalles de factura encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleFactura'
 *       404:
 *         description: No se encontraron detalles de factura.
 */
router.get("/", async (req, res) => {
  detalleFacturaService.getAllDetallesFactura(req, res);
});

/**
 * @swagger
 * /detalles-facturas/{id}:
 *   get:
 *     summary: Obtener un detalle de factura por ID
 *     description: Devuelve los detalles de una factura específica por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del detalle de factura a obtener.
 *     responses:
 *       200:
 *         description: Detalle de factura encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleFactura'
 *       404:
 *         description: Detalle de factura no encontrado.
 */
router.get("/:id", async (req, res) => {
  detalleFacturaService.getDetalleFacturaById(req, res);
});

/**
 * @swagger
 * /detalles-facturas:
 *   post:
 *     summary: Crear un nuevo detalle de factura
 *     description: Crea un nuevo detalle de factura con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       201:
 *         description: Detalle de factura creado exitosamente.
 *       400:
 *         description: Datos inválidos.
 */
router.post("/", async (req, res) => {
  detalleFacturaService.crearDetalleFactura(req, res);
});

/**
 * @swagger
 * /detalles-facturas/{id}:
 *   patch:
 *     summary: Actualizar un detalle de factura
 *     description: Actualiza la información de un detalle de factura existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del detalle de factura a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       200:
 *         description: Detalle de factura actualizado correctamente.
 *       404:
 *         description: Detalle de factura no encontrado.
 */
router.patch("/:id", async (req, res) => {
  detalleFacturaService.editarDetalleFactura(req, res);
});

/**
 * @swagger
 * /detalles-facturas/{id}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     description: Elimina un detalle de factura del sistema por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del detalle de factura a eliminar.
 *     responses:
 *       200:
 *         description: Detalle de factura eliminado exitosamente.
 *       404:
 *         description: Detalle de factura no encontrado.
 */
router.delete("/:id", async (req, res) => {
  detalleFacturaService.eliminarDetalleFactura(req, res);
});

module.exports = router;