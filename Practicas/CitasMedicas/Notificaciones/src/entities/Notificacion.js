const { EntitySchema } = require("typeorm");

module.exports.Notificacion = new EntitySchema({
  name: "Notificaciones",
  tableName: "notificaciones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    paciente_id: {
      type: "int",
    },
    medico_id: {
      type: "int",
    },
    rol: {
      type: "varchar",
      default: "usuario",
    },
    accion : {
      type: "varchar",
    },
    mensaje: {
      type: "varchar",
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});