const { getRepository } = require("typeorm");
const { Notificacion } = require("../entities/Notificacion");
const logger = require("../utils/logger");

const getIpFromContext = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

const obtenerNotificacionesPacientes = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const paciente_id = req.params.id;
    if (!paciente_id) {
      logger.warn(
        `Consulta de notificaciones - Usuario: ${paciente_id}, IP: ${ip}, Acción: Obtener Notificaciones, Resultado: ID de paciente o médico no proporcionado`
      );
      return res.status(400).json({
        transaccion: false,
        mensaje: "ID de usuario no proporcionado",
        datos: null,
      });
    }
    const query = getRepository(Notificacion).createQueryBuilder("notificacion");
    query.where("notificacion.paciente_id = :paciente_id", { paciente_id });
    query.addOrderBy("notificacion.fecha", "DESC");
    const notificaciones = await query.getMany();
    if (notificaciones.length > 0) {
      logger.info(
        `Consulta de notificaciones - Usuario: ${paciente_id}, IP: ${ip}, Acción: Obtener Notificaciones`
      );
      res.json({
        transaccion: true,
        mensaje: "Notificaciones encontradas del medico",
        datos: notificaciones,
      });
    } else {
      logger.info(
        `Consulta de notificaciones - Usuario: ${usuario_log}, IP: ${ip}, Acción: Obtener Notificaciones, Resultado: No se encontraron notificaciones`
      );
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron notificaciones",
        datos: null,
      });
    }
  } catch (error) {
    logger.error(
      `Error al obtener notificaciones - Usuario: ${usuario_log}, IP: ${ip}, Acción: Listar Notificaciones, Error: ${error.message}`
    );
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor pacientes: " + error.message,
      datos: null,
    });
  }
}

const obtenerNotificacionesMedicos = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const medico_id = req.params.id;
    if (!medico_id) {
      logger.warn(
        `Consulta de notificaciones - Usuario: ${medico_id}, IP: ${ip}, Acción: Obtener Notificaciones, Resultado: ID de paciente o médico no proporcionado`
      );
      return res.status(400).json({
        transaccion: false,
        mensaje: "ID de usuario no proporcionado",
        datos: null,
      });
    }
    const query = getRepository(Notificacion).createQueryBuilder("notificacion");
    query.where("notificacion.medico_id = :medico_id", { medico_id });
    query.addOrderBy("notificacion.fecha", "DESC");
    const notificaciones = await query.getMany();
    if (notificaciones.length > 0) {
      logger.info(
        `Consulta de notificaciones - Usuario: ${medico_id}, IP: ${ip}, Acción: Obtener Notificaciones`
      );
      res.json({
        transaccion: true,
        mensaje: "Notificaciones encontradas",
        datos: notificaciones,
      });
    } else {
      logger.info(
        `Consulta de notificaciones - Usuario: ${usuario_log}, IP: ${ip}, Acción: Obtener Notificaciones, Resultado: No se encontraron notificaciones`
      );
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron notificaciones",
        datos: null,
      });
    }
  } catch (error) {
    logger.error(
      `Error al obtener notificaciones - Usuario: ${usuario_log}, IP: ${ip}, Acción: Listar Notificaciones, Error: ${error.message}`
    );
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor medicos: " + error.message,
      datos: null,
    });
  }
}

const obtenerNotificaciones = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const query = getRepository(Notificacion).createQueryBuilder("notificacion");
    query.addOrderBy("notificacion.fecha", "DESC");
    const notificaciones = await query.getMany();
    if (notificaciones.length > 0) {
      logger.info(
        `Consulta de notificaciones - Usuario: admin, IP: ${ip}, Acción: Obtener Notificaciones`
      );
      res.json({
        transaccion: true,
        mensaje: "Notificaciones encontradas",
        datos: notificaciones,
      });
    }
  } catch (error) {
    logger.error(
      `Error al obtener notificaciones - Usuario: ${usuario_log}, IP: ${ip}, Acción: Listar Notificaciones, Error: ${error.message}`
    );
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
}

const registrarNotificacion = async (data) => {
  const { medico_id, paciente_id,rol, accion, mensaje } = data;

  if (!medico_id || !paciente_id || !rol || !accion || !mensaje) {
    throw new Error("Datos incompletos");
  }

  const notificacionRepo = getRepository(Notificacion);
  const nuevaNotificacion = notificacionRepo.create({
    medico_id,
    paciente_id,
    rol,
    accion,
    mensaje,
  });

  const notificacionGuardada = await notificacionRepo.save(nuevaNotificacion);
  logger.info(
    `Notificación registrada - Paciente ID: ${paciente_id}, Medcico ID: ${medico_id}, Rol: ${rol}, Acción: ${accion}, Mensaje: ${mensaje}`
  );
  return notificacionGuardada;
};

module.exports = {
  obtenerNotificacionesMedicos,
  obtenerNotificacionesPacientes,
  registrarNotificacion,
  obtenerNotificaciones
};