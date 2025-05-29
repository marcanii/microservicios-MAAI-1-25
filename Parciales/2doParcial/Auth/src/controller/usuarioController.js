const express = require("express");
const router = express.Router();
const usuarioService = require("../service/usuarioService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - correo
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario (autogenerado).
 *         correo:
 *           type: string
 *           description: correo del usuario.
 *         password:
 *           type: string
 *           description: password del usuario.
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista de todos los usuarios en el sistema.
 *     responses:
 *       200:
 *         description: Lista de usuarios encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: No se encontraron usuarios.
 */
router.get("/", (req, res) => {
  usuarioService.obtenerUsuarios(req, res);
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Error de validación de datos.
 */
router.post("/", (req, res) => {
  usuarioService.registrarUsuario(req, res);
});

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión con su correo y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       400:
 *         description: Error de validación de datos.
 */
router.post("/login", (req, res) => {
  usuarioService.login(req, res);
});

module.exports = router;