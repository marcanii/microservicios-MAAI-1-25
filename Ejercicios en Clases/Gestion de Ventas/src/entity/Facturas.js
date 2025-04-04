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
  },
  relations: {
    cliente: {
      type: "many-to-one",
      target: "Clientes",
      joinColumn: { name: "cliente_id" },
      onDelete: "CASCADE",
      nullable: false,
    },
    detalles: {
      type: "one-to-many",
      target: "DetalleFacturas",
      inverseSide: "factura",
    },
  },
});
