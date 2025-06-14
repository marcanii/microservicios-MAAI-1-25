const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  dia: String, // Ej: "Lunes"
  desde: String, // Ej: "08:00"
  hasta: String  // Ej: "12:00"
});

const medicoSchema = new mongoose.Schema({
  medico_id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  especialidades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad' }],
  horarios: [horarioSchema]
});

module.exports = mongoose.model('Medico', medicoSchema);
