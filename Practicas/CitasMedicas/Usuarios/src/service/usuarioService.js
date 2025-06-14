const { getRepository } = require("typeorm");
const { Usuario } = require("../entity/Usuario");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const getIpFromContext = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const query = getRepository(Usuario).createQueryBuilder("usuario");
    query.addOrderBy("usuario.id", "ASC");
    const total = await query.getCount();
    const usuarios = await query.skip(skip).take(limit).getMany();
    if (usuarios.length > 0) {
      logger.info(
        `Consulta de usuarios - Usuario: ${usuario_log}, IP: ${ip}, Acción: Obtener Usuarios`
      );
      res.json({
        transaccion: true,
        mensaje: "Usuarios encontrados",
        datos: usuarios,
        paginacion: {
          pagina: Number(page),
          limite: Number(limit),
          total,
          paginas: Math.ceil(total / limit),
        },
      });
    } else {
      logger.info(
        `Consulta de usuarios - Usuario: ${usuario_log}, IP: ${ip}, Acción: Obtener Usuarios, Resultado: No se encontraron usuarios`
      );
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron usuarios",
        datos: null,
      });
    }
  } catch (error) {
    logger.error(
      `Error al obtener usuarios: - Usuario: ${usuario_log}, IP: ${ip}, Acción: Listar Usuarios, Error: ${error.message}`
    );
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
};

const obtenerUsuariosPorRol = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const { rol } = req.params;
    if (!rol) {
      return res.status(400).json({
        transaccion: false,
        mensaje: "Rol es requerido",
        datos: null,
      });
    }
    const usuarios = await getRepository(Usuario).find({ where: { rol } });
    if (usuarios.length > 0) {
      logger.info(
        `Consulta de usuarios por rol - Usuario: ${usuario_log}, IP: ${ip}, Acción: Obtener Usuarios por Rol`
      );
      res.json({
        transaccion: true,
        mensaje: "Usuarios encontrados",
        datos: usuarios,
      });
    } else {
      logger.info(
        `Consulta de usuarios por rol - Usuario: ${usuario_log}, IP: ${ip}, Acción: Obtener Usuarios por Rol, Resultado: No se encontraron usuarios con el rol ${rol}`
      );
      res.status(404).json({
        transaccion: false,
        mensaje: `No se encontraron usuarios con el rol ${rol}`,
        datos: null,
      });
    }
  }
  catch (error) {
    logger.error(
      `Error al obtener usuarios por rol: - Usuario: ${usuario_log}, IP: ${ip}, Acción: Listar Usuarios por Rol, Error: ${error.message}`
    );
    console.error("Error al obtener usuarios por rol:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
}

const registrarUsuario = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const { correo, password, rol, nombres, apellidos, celular } = req.body;
    if (!correo || !password) {
      return res.status(400).json({
        transaccion: false,
        mensaje: "Correo y contraseña son requeridos",
        datos: null,
      });
    }
    const passwordHash = require("bcryptjs").hashSync(password, 8);
    const usuario = getRepository(Usuario).create({
      correo,
      password: passwordHash,
      rol: rol || "usuario",
      nombres: nombres,
      apellidos: apellidos,
      celular: celular,
    });
    await getRepository(Usuario).save(usuario);
    logger.info(
      `Registro de usuario - Usuario: ${usuario_log}, IP: ${ip}, Acción: Registrar Usuario`
    );
    res.status(201).json({
      transaccion: true,
      mensaje: "Usuario registrado exitosamente",
      datos: {
        id: usuario.id,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    logger.error(
      `Error al registrar usuario: - Usuario: ${usuario_log}, IP: ${ip}, Acción: Registrar Usuario, Error: ${error.message}`
    );
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
};

const login = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.nombre || "anónimo";
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({
        transaccion: false,
        mensaje: "Correo y contraseña son requeridos",
        datos: null,
      });
    }
    const usuario = await getRepository(Usuario).findOne({ where: { correo } });
    if (
      !usuario ||
      !require("bcryptjs").compareSync(password, usuario.password)
    ) {
      logger.info(
        `Login de usuario => Credenciales invalidas - Usuario: ${usuario_log}, IP: ${ip}, Acción: Login Usuario`
      );
      return res.status(401).json({
        transaccion: false,
        mensaje: "Credenciales inválidas",
        datos: null,
      });
    }
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET || "mi_secret_jwt",
      { expiresIn: "1h" }
    );
    logger.info(
      `Login de usuario exitoso - Usuario: ${usuario_log}, IP: ${ip}, Acción: Login Usuario`
    );
    res.json({
      transaccion: true,
      mensaje: "Login exitoso",
      token,
      datos: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    logger.error(
      `Error al iniciar sesión - Usuario: ${usuario_log}, IP: ${ip}, Acción: Login Usuario, Error: ${error.message}`
    );
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
};

const consultarPerfil = async (req, res) => {
  const ip = getIpFromContext(req);
  const usuario_log = req?.user?.correo || "anónimo";
  try {
    const usuarioId = req.params.id;
    const usuario = await getRepository(Usuario).findOne({
      where: { id: usuarioId },
    });
    if (!usuario) {
      logger.info(
        `Consulta de perfil - Usuario: ${usuario_log}, IP: ${ip}, Acción: Consultar Perfil, Resultado: Usuario no encontrado`
      );
      return res.status(404).json({
        transaccion: false,
        mensaje: "Usuario no encontrado",
        datos: null,
      });
    }
    logger.info(
      `Consulta de perfil - Usuario: ${usuario_log}, IP: ${ip}, Acción: Consultar Perfil`
    );
    res.json({
      transaccion: true,
      mensaje: "Perfil consultado exitosamente",
      datos: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        celular: usuario.celular,
      },
    });
  } catch (error) {
    console.error("Error al consultar perfil:", error);
    logger.error(
      `Error al consultar perfil - Usuario: ${usuario_log}, IP: ${ip}, Acción: Consultar Perfil, Error: ${error.message}`
    );
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
};

module.exports = {
  obtenerUsuarios,
  registrarUsuario,
  login,
  consultarPerfil,
  obtenerUsuariosPorRol
};
