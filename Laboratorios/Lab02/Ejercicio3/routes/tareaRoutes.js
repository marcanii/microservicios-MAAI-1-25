const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea');

router.get('/tareas', async (req, res) => {
    try {
        const tareas = await Tarea.find();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas' });
    }
});

router.post('/tareas', async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear tarea' });
    }
});

router.put('/tareas/:id', async (req, res) => {
    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
        if (!tareaActualizada) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(tareaActualizada);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar tarea' });
    }
});

router.delete('/tareas/:id', async (req, res) => {
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
        if (!tareaEliminada) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar tarea' });
    }
});

module.exports = router;