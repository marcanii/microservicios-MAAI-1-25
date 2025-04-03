const { EntitySchema } = require("typeorm");

module.exports.Cliente = new EntitySchema({
  name: "Clientes",
  tableName: "clientes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombres: {
      type: "varchar",
    },
    apellidos: {
      type: "varchar",
    },
    sexo: {
      type: "varchar",
    }
  },
});