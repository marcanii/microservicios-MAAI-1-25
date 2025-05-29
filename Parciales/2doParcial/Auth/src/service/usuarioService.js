const { getRepository } = require("typeorm");
const { Usuario } = require("../entity/Usuario");
const jwt = require("jsonwebtoken");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const query = getRepository(Usuario).createQueryBuilder("usuario");

    query.addOrderBy("usuario.id", "ASC");
    const total = await query.getCount();
    const usuarios = await query.skip(skip).take(limit).getMany();

    if (usuarios.length > 0) {
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
      res.status(404).json({
        transaccion: false,
        mensaje: "No se encontraron usuarios",
        datos: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
}

const registrarUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({
        transaccion: false,
        mensaje: "Correo y contraseña son requeridos",
        datos: null,
      });
    }
    const passwordHash = require("bcryptjs").hashSync(password, 8);
    const usuario = getRepository(Usuario).create({ correo, password: passwordHash });
    await getRepository(Usuario).save(usuario);
    res.status(201).json({
      transaccion: true,
      mensaje: "Usuario registrado exitosamente",
      datos: {
        id: usuario.id,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
}

const login = async (req, res) => {
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
    if (!usuario || !require("bcryptjs").compareSync(password, usuario.password)) {
      return res.status(401).json({
        transaccion: false,
        mensaje: "Credenciales inválidas",
        datos: null,
      });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    res.json({
      transaccion: true,
      mensaje: "Login exitoso",
      token,
      datos: {
        id: usuario.id,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      transaccion: false,
      mensaje: "Error en el servidor: " + error.message,
      datos: null,
    });
  }
}

module.exports = {
  obtenerUsuarios,
  registrarUsuario,
  login,
};