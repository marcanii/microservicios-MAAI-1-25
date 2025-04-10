const express = require("express");
const router = express.Router();
const Libro = require("../models/Libro");

router.get("/libro", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros" });
  }
});

router.post("/libro", async (req, res) => {
  try {
    const nuevaLibro = new Libro(req.body);
    await nuevaLibro.save();
    res.status(201).json(nuevaLibro);
  } catch (error) {
    res.status(400).json({ message: "Error al crear libro" });
  }
});

router.put("/libro/:id", async (req, res) => {
  try {
    const libroActualizada = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
        editorial: req.body.editorial,
        anio: req.body.anio,
        descripcion: req.body.descripcion,
        num_paginas: req.body.num_paginas,
      },
      { new: true }
    );
    if (!libroActualizada)
      return res.status(404).json({ message: "Libro no encontrada" });
    res.json(libroActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar libro" });
  }
});

router.delete("/libro/:id", async (req, res) => {
  try {
    const libroEliminada = await Libro.findByIdAndDelete(req.params.id);
    if (!libroEliminada)
      return res.status(404).json({ message: "Libro no encontrada" });
    res.json({ message: "Libro eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar libro" });
  }
});

module.exports = router;