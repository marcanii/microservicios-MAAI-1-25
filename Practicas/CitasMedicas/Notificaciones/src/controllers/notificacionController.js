const express = require("express");
const router = express.Router();
const notificacionService = require("../services/notificacionService");

/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       required:
 *         - usuario_id
 *         - rol
 *         - accion
 *         - mensaje
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario (autogenerado).
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario al que pertenece la notificación.
 *         rol:
 *           type: string
 *           description: Rol del usuario (por defecto "usuario").
 *         accion:
 *           type: string
 *           description: Acción realizada que genera la notificación.
 *         mensaje:
 *           type: string
 *           description: Mensaje de la notificación.
 */

router.get("/", (req, res) => {
  notificacionService.obtenerNotificaciones(req, res);
});

router.get("/by-paciente/:id", (req, res) => {
  notificacionService.obtenerNotificacionesPacientes(req, res);
});

router.get("/by-medico/:id", (req, res) => {
  notificacionService.obtenerNotificacionesMedicos(req, res);
});

module.exports = router;