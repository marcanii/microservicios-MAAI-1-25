const { EntitySchema } = require("typeorm");

module.exports.Factura = new EntitySchema({
  name: "Facturas",
  tableName: "facturas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fecha: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    cliente_id: {
      type: "int",
      nullable: false,
    },
  },
});