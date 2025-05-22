require 'bunny'
require 'json'

# Conectarse a RabbitMQ
conn = Bunny.new(hostname: 'localhost')
conn.start

channel = conn.create_channel
queue = channel.queue('notificaciones_compra')

# Datos de ejemplo de la compra
mensaje = {
  email: "joseorly69@gmail.com",
  evento: "Concierto Rock",
  fecha: "2025-05-21",
  cantidad: 5
}

# Publicar el mensaje en la cola
queue.publish(mensaje.to_json)

puts "Mensaje publicado en la cola notificaciones_compra"

conn.close
