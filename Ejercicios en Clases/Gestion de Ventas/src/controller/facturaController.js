const express = require("express");
const router = express.Router();
const facturaService = require("../service/facturaService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Factura:
 *       type: object
 *       required:
 *         - fecha
 *         - cliente
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la factura (autogenerado).
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de creación de la factura.
 *         cliente:
 *           type: object
 *           description: Cliente asociado a la factura.
 *           properties:
 *             id:
 *               type: integer
 *               description: ID del cliente.
 *             nombres:
 *               type: string
 *               description: Nombres del cliente.
 *             apellidos:
 *               type: string
 *               description: Apellidos del cliente.
 *         detalles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DetalleFactura'
 *           description: Detalles de los productos en la factura.
 */

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtener todas las facturas
 *     description: Devuelve una lista de todas las facturas en el sistema.
 *     responses:
 *       200:
 *         description: Lista de facturas encontradas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       404:
 *         description: No se encontraron facturas.
 */
router.get("/", (req, res) => {
  facturaService.getAllFacturas(req, res);
});

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     description: Devuelve la factura con el ID especificado.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID de la factura a obtener.
 *     responses:
 *       200:
 *         description: Factura encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura no encontrada.
 */
router.get("/:id", (req, res) => {
  facturaService.getFacturaById(req, res);
});

/**
 * @swagger
 * /facturas/cliente/{id}:
 *   get:
 *     summary: Obtener facturas por ID de cliente
 *     description: Devuelve todas las facturas asociadas a un cliente específico.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del cliente cuyas facturas se desean obtener.
 *     responses:
 *       200:
 *         description: Facturas encontradas para el cliente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       404:
 *         description: No se encontraron facturas para el cliente.
 */
router.get("/cliente/:id", (req, res) => {
  facturaService.getFacturaByClienteId(req, res);
});

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Crear una nueva factura
 *     description: Crea una nueva factura con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       201:
 *         description: Factura creada exitosamente.
 *       400:
 *         description: Datos inválidos para crear la factura.
 */
router.post("/", (req, res) => {
  facturaService.createFactura(req, res);
});

/**
 * @swagger
 * /facturas/{id}:
 *   patch:
 *     summary: Actualizar una factura
 *     description: Actualiza la información de una factura existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID de la factura a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente.
 *       404:
 *         description: Factura no encontrada.
 */
router.patch("/:id", (req, res) => {
  facturaService.editFactura(req, res);
});

/**
 * @swagger
 * /facturas/{id}:
 *   delete:
 *     summary: Eliminar una factura
 *     description: Elimina una factura del sistema por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID de la factura a eliminar.
 *     responses:
 *       200:
 *         description: Factura eliminada exitosamente.
 *       404:
 *         description: Factura no encontrada.
 */
router.delete("/:id", (req, res) => {
  facturaService.deleteFactura(req, res);
});

module.exports = router;