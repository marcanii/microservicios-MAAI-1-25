# el modelo de compra que contiene el id de la compra, el id del evento, el nombre del evento, el precio del evento, la cantidad y el total
# el id de la compra es el id de la compra que se genera al momento de realizar la compra al igual que el total

class Compras < ActiveRecord::Base
    self.table_name = 'compras'
    self.primary_key = 'id_compra'

    validates :id_evento, presence: true
    validates :nombre_evento, presence: true
    validates :precio_evento, presence: true
    validates :cantidad, presence: true
    validates :pagado, inclusion: { in: [true, false] }
    validates :total, presence: true
    validates :created_at, presence: true
end
