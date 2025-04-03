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
    producto_id: {
      type: "int",
      nullable: false,
    },
    factura_id: {
      type: "int",
      nullable: false,
    },
  },
});