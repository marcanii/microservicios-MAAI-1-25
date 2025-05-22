# el modelo de compra que contiene el id de la compra, el id del evento, el nombre del evento, el precio del evento, la cantidad y el total
# el id de la compra es el id de la compra que se genera al momento de realizar la compra al igual que el total

class Notificaciones < ActiveRecord::Base
    self.table_name = 'mensajes'
    self.primary_key = 'id'

    validates :id_evento, presence: true
    validates :nombre_evento, presence: true
    validates :id_usuario, presence: true
    validates :nombre_usuario, presence: true
    validates :pagado, inclusion: { in: [true, false] }
    validates :created_at, presence: true
    validates :total, presence: true
end
