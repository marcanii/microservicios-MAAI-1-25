# la clase se crea con lo siguiente, id_evento, nombre_evento, precio_evento, cantidad, pagado, created_at y total

class CreateCompras < ActiveRecord::Migration[6.0]
  def change
    create_table :compras do |t|
      t.integer :id_evento, null: false
      t.string :nombre_evento, null: false
      t.decimal :precio_evento, precision: 10, scale: 2, null: false
      t.integer :cantidad, null: false
      t.boolean :pagado, default: false
      t.decimal :total, precision: 10, scale: 2, null: false
      t.datetime :created_at, null: false

      t.timestamps
    end

    add_index :compras
  end
end