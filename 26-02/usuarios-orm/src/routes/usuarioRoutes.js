const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Usuario } = require("../entity/Usuario");
const controlador = require("../controller/usuarioController");

router.get("/", async (req, res) => {
 controlador.obtenerUsuarios(req, res);
});

router.get("/:id", async (req, res) => {
  const usuario = await getRepository(Usuario).findOneBy({id:req.params.id});
  res.json(usuario);
});;

router.post("/", async (req, res) => {
  const { correo, contraseña, nombre, rol } = req.body;
  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const nuevoUsuario = getRepository(Usuario).create({
    correo,
    contraseña: hashedPassword,
    nombre,
    rol,
  });
  await getRepository(Usuario).save(nuevoUsuario);
  res.json(nuevoUsuario);
});

router.put("/:id", async (req, res) => {
  console.log("entro");
  const { correo, nombre, rol } = req.body;
  const usuario = await getRepository(Usuario).findOneBy({id:req.params.id});
  console.log(usuario);
  if (usuario) {
    usuario.correo = correo;
    usuario.nombre = nombre;
    usuario.rol = rol;
    await getRepository(Usuario).save(usuario);
  }
  res.json(usuario);
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  await getRepository(Usuario).delete(req.params.id);
  res.json({ mensaje: "Usuario eliminado" });
});

module.exports = router;
