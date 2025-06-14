const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Especialidad', especialidadSchema);
