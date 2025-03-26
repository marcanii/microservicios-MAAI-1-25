const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("bienvenido.html", { root: __dirname + "/public" });
});

app.get("/listar", (req, res) => {
  db.query(
    "SELECT id,nombre,correo_electronico,fecha_registro FROM usuarios",
    (error, usuarios) => {
      if (error) {
        console.log("Error al ejecutar la consulta");
        return;
      }
      res.render("listar", { usuarios });
    }
  );
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", (req, res) => {
  const { nombre, correo_electronico, fecha_registro } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre, correo_electronico, fecha_registro) VALUES (?, ?, ?)",
    [nombre, correo_electronico, fecha_registro],
    (error, resultado) => {
      if (error) {
        console.log("Error al insertar la agenda");
        return;
      }
      res.redirect("/listar");
    }
  );
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT id, nombre, correo_electronico, fecha_registro FROM usuarios WHERE id = ?",
    [id],
    (error, usuarios) => {
      if (error) {
        console.log("Error al ejecutar la consulta");
        return;
      }
      res.render("edit", { usuario: usuarios[0] });
    }
  );
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, correo_electronico, fecha_registro } = req.body;
  db.query(
    "UPDATE usuarios SET nombre = ?, correo_electronico = ?, fecha_registro = ? WHERE id = ?",
    [nombre, correo_electronico, fecha_registro, id],
    (error, resultado) => {
      if (error) {
        console.log("Error al actualizar el usuario");
        return;
      }
      res.redirect("/listar");
    }
  );
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (error, resultado) => {
    if (error) {
      console.log("Error al eliminar el producto");
      return;
    }
    res.redirect("/listar");
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
