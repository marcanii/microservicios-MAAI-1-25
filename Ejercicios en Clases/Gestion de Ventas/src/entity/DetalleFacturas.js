const { EntitySchema } = require("typeorm");

module.exports.DetalleFactura = new EntitySchema({
  name: "DetalleFacturas",
  tableName: "detalle_facturas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    cantidades: {
      type: "int",
    },
    precios: {
      type: "decimal",
    },
  },
  relations: {
    producto: {
      type: "many-to-one",
      target: "Productos",
      joinColumn: { name: "producto_id" },
      nullable: false,
      onDelete: "RESTRICT",
    },
    factura: {
      type: "many-to-one",
      target: "Facturas",
      joinColumn: { name: "factura_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});
