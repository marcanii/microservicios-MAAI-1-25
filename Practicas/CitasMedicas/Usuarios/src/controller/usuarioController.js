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
 *         - rol
 *         - nombres
 *         - apellidos
 *         - celular
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
 *         rol:
 *           type: string
 *           description: Rol del usuario (por defecto "usuario").
 *         nombres:
 *           type: string
 *           description: Nombres del usuario.
 *         apellidos:
 *           type: string
 *           description: Apellidos del usuario.
 *         celular:
 *           type: string
 *           description: Número de celular del usuario.
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Consultar perfil de usuario
 *     description: Devuelve el perfil de un usuario específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a consultar.
 *     responses:
 *       200:
 *         description: Perfil del usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado.
 */

router.get("/:id", (req, res) => {
  usuarioService.consultarPerfil(req, res);
});


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

router.get("/by-role/:rol", (req, res) => {
  usuarioService.obtenerUsuariosPorRol(req, res);
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