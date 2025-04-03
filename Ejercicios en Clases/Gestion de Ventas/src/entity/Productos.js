const { EntitySchema } = require("typeorm");

module.exports.Producto = new EntitySchema({
  name: "Productos",
  tableName: "productos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    descripcion: {
      type: "varchar",
      nullable: false,
    },
    marca: {
      type: "varchar",
      nullable: false,
    },
    stock: {
      type: "int",
      nullable: false,
      default: 0,
    },
  },
});