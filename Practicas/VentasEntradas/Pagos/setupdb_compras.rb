require 'active_record'

ActiveRecord::Base.establish_connection(
    adapter: 'mysql2',
    host: 'localhost',
    database: 'mi_api_db',
    username: 'root',
    password: 'root'
)

unless ActiveRecord::Base.connection.table_exists?(:compras)
    ActiveRecord::Schema.define do
        create_table :compras do |t|
            t.integer :id_evento, null: false
            t.string :nombre_evento, null: false
            t.decimal :precio_evento, precision: 10, scale: 2, null: false
            t.integer :cantidad, null: false
            t.boolean :pagado, default: false
            t.decimal :total, precision: 10, scale: 2, null: false
            t.datetime :created_at, null: false
        end
    end
end