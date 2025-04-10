const mongoose = require('mongoose');

const LibroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editorial: { type: String, required: true },
    anio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    num_paginas: { type: Number, required: true}
});

module.exports = mongoose.model('Libro', LibroSchema);