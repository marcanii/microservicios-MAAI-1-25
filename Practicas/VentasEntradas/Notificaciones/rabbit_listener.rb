require 'bunny'
require 'mail'
require 'json'

# Configuración del email (ejemplo con Gmail)
Mail.defaults do
  delivery_method :smtp, {
    address: "smtp.gmail.com",
    port: 587,
    user_name: 'joseorlandorodriguez321@gmail.com',  
    password: 'vkswghmklhlwlhdd', 
    authentication: 'plain',
    enable_starttls_auto: true
  }
end

# Conexión a RabbitMQ
connection = Bunny.new
connection.start
channel = connection.create_channel
queue = channel.queue("notificaciones_compra")

puts "Escuchando la cola 'notificaciones_compra'..."

queue.subscribe(block: true) do |_delivery_info, _properties, body|
  puts "Mensaje recibido: #{body}"

  begin
    data = JSON.parse(body)

    destinatario = data["email"]

    if destinatario.nil? || destinatario.strip.empty?
      puts "Error: destinatario vacío, no se puede enviar email"
      next
    end

    asunto = "Confirmación de compra para #{data["evento"]}"
    cuerpo = <<~EMAIL
      Hola,

      Gracias por tu compra.

      Evento: #{data["evento"]}
      Fecha: #{data["fecha"]}
      Cantidad: #{data["cantidad"]}

      Saludos,
      Tu equipo de ventas
    EMAIL

    Mail.deliver do
      from    'joseorlandorodriguez321@gmail.com'    # Cambia por tu correo
      to      destinatario
      subject asunto
      body    cuerpo
    end

    puts "Correo enviado a #{destinatario}"

  rescue JSON::ParserError => e
    puts "Error al parsear JSON: #{e.message}"
  rescue => e
    puts "Error enviando correo: #{e.message}"
  end
end


