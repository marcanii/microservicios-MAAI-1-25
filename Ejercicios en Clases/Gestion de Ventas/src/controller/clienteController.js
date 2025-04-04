const express = require("express");
const router = express.Router();
const clienteService = require("../service/clienteService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nombres
 *         - apellidos
 *         - sexo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del cliente (autogenerado).
 *         nombres:
 *           type: string
 *           description: Nombre(s) del cliente.
 *         apellidos:
 *           type: string
 *           description: Apellido(s) del cliente.
 *         sexo:
 *           type: string
 *           description: Sexo del cliente (M/F).
 *         facturas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Factura'
 *           description: Lista de facturas asociadas al cliente.
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Devuelve una lista de todos los clientes en el sistema.
 *     responses:
 *       200:
 *         description: Lista de clientes encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: No se encontraron clientes.
 */
router.get("/", (req, res) => {
  clienteService.obtenerClientes(req, res);
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     description: Devuelve los detalles de un cliente específico por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del cliente a obtener.
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado.
 */
router.get("/:id", (req, res) => {
  clienteService.obtenerClientePorId(req, res);
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     description: Crea un nuevo cliente con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente.
 *       400:
 *         description: Datos inválidos.
 */
router.post("/", (req, res) => {
  clienteService.crearCliente(req, res);
});

/**
 * @swagger
 * /clientes/{id}:
 *   patch:
 *     summary: Actualizar un cliente
 *     description: Actualiza la información de un cliente existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del cliente a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente.
 *       404:
 *         description: Cliente no encontrado.
 */
router.patch("/:id", (req, res) => {
  clienteService.editarCliente(req, res);
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente del sistema por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: El ID del cliente a eliminar.
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente.
 *       404:
 *         description: Cliente no encontrado.
 */
router.delete("/:id", (req, res) => {
  clienteService.eliminarCliente(req, res);
});

module.exports = router;