const { EntitySchema } = require("typeorm");

module.exports.Usuario = new EntitySchema({
  name: "Usuarios",
  tableName: "usuarios",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    correo: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
  },
});