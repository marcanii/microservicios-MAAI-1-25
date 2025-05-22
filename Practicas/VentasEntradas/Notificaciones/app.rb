require 'sinatra'
require 'sinatra/activerecord'
require 'json'
require './models/notificaciones'
require 'mail'

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

set :database_file, 'config/database.yml'
set :port, ENV.fetch('PORT', 4003)

get '/' do
    content_type :json
    { message: 'Bienvenido a la API de notificaciones' }.to_json
end

# Obtener todas las notificaciones de un usuario por su ID
get '/api/notificaciones/usuario/:id_usuario' do
    content_type :json
    
    # Convertir el parámetro a entero
    id_usuario = params['id_usuario'].to_i
    
    # Buscar todas las notificaciones del usuario
    notificaciones = Notificaciones.where(id_usuario: id_usuario)
    
    if notificaciones.any?
        # Convertir a array de hashes para la respuesta JSON
        notificaciones.map do |notificacion|
            {
                id: notificacion.id,
                id_evento: notificacion.id_evento,
                nombre_evento: notificacion.nombre_evento,
                id_usuario: notificacion.id_usuario,
                nombre_usuario: notificacion.nombre_usuario,
                pagado: notificacion.pagado,
                total: notificacion.total,
                created_at: notificacion.created_at,
            }
        end.to_json
    else
        { message: "No se encontraron notificaciones para el usuario con ID #{id_usuario}" }.to_json
    end
end

post '/api/notificaciones' do
    content_type :json
    request.body.rewind
    data = JSON.parse(request.body.read)
    notificacion = Notificaciones.new(
        id_evento: data['id_evento'],
        nombre_evento: data['nombre_evento'],
        id_usuario: data['id_usuario'],
        nombre_usuario: data['nombre_usuario'],
        pagado: data['pagado'],
        total: data['total'],
        created_at: Time.now
    )
    if notificacion.save
        enviar_correo(notificacion)  # Aquí se llama el correo
        { message: 'Notificación creada exitosamente', notificacion: notificacion }.to_json
    else
        { message: 'Error al crear la notificación', errors: notificacion.errors.full_messages }.to_json
    end
end


def enviar_correo(notificacion)
  Mail.deliver do
    to notificacion.nombre_usuario
    from 'joseorlandorodriguez321@gmail.com'
    subject "Nuevo evento: #{notificacion.nombre_evento}"
    body "Hola #{notificacion.nombre_usuario},\n\nHas sido notificado sobre el evento '#{notificacion.nombre_evento}'.\nMonto total: #{notificacion.total}, Pagado: #{notificacion.pagado}.\n\nGracias."
  end
end