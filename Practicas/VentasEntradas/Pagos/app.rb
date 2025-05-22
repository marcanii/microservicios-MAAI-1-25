require 'sinatra'
require 'sinatra/activerecord'
require 'json'
require './models/compras'

set :database_file, 'config/database.yml'
set :port, ENV.fetch('PORT', 4002)

get '/' do
    content_type :json
    { message: 'Bienvenido a la API de eventos' }.to_json
end

# Obtener todas las compras de un usuario por su ID
get '/api/pagos/compras-usuario/:id_usuario' do
  content_type :json
  
  # Convertir el parámetro a entero
  id_usuario = params['id_usuario'].to_i
  
  # Buscar todas las compras del usuario
  compras = Compras.where(id_usuario: id_usuario).order(created_at: :desc)
  
  if compras.any?
    # Convertir a array de hashes para la respuesta JSON
    compras.map do |compra|
      {
        id: compra.id,
        id_evento: compra.id_evento,
        nombre_evento: compra.nombre_evento,
        precio_evento: compra.precio_evento,
        cantidad: compra.cantidad,
        total: compra.total,
        id_usuario: compra.id_usuario,
        nombre_usuario: compra.nombre_usuario,
        created_at: compra.created_at,
        pagado: compra.pagado,
        # Excluimos datos sensibles como num_tarjeta, expiracion y cvv
      }
    end.to_json
  else
    { message: "No se encontraron compras para el usuario con ID #{id_usuario}" }.to_json
  end
end


# compra de entradas
post '/api/pagos/comprar-entradas' do
    content_type :json
    request.body.rewind
    data = JSON.parse(request.body.read)
    compra = Compras.new(
        id_evento: data['id_evento'],
        nombre_evento: data['nombre_evento'],
        precio_evento: data['precio_evento'],
        cantidad: data['cantidad'],
        total: data['precio_evento'] * data['cantidad'],
        id_usuario: data['id_usuario'],
        nombre_usuario: data['nombre_usuario'],
        num_tarjeta: data['num_tarjeta'],
        expiracion: data['expiracion'],
        cvv: data['cvv'],
        created_at: Time.now,
        pagado: false
    )
    if compra.save
        {   message: 'se realizó la solicitud de pago..',
            id_evento: compra.id_evento,
            nombre_evento: compra.nombre_evento,
            precio_evento: compra.precio_evento,
            cantidad: compra.cantidad,
            total: compra.total,
            id_usuario: compra.id_usuario,
            nombre_usuario: compra.nombre_usuario,
            num_tarjeta: compra.num_tarjeta,
            expiracion: compra.expiracion,
            cvv: compra.cvv,
            created_at: compra.created_at,
            pagado: compra.pagado,
        }.to_json
    else
        { error: 'Error al realizar la compra' }.to_json
    end
end

# confirmacion de pagos
post '/api/pagos/confirmar-pago' do
    content_type :json
    request.body.rewind
    data = JSON.parse(request.body.read)
    compra = Compras.find_by(id: data['id'])
    if compra.nil?
        return { error: 'Compra no encontrada' }.to_json
    end
    if compra.pagado
        return { error: 'La compra ya fue pagada' }.to_json
    end
    # Actualiza el estado de la compra a pagado
    compra.pagado = true
    if compra.save
        { message: 'Pago confirmado', 
            id_evento: compra.id_evento,
            nombre_evento: compra.nombre_evento,
            precio_evento: compra.precio_evento,
            cantidad: compra.cantidad,
            total: compra.total,
            id_usuario: compra.id_usuario,
            nombre_usuario: compra.nombre_usuario,
            num_tarjeta: compra.num_tarjeta,
            expiracion: compra.expiracion,
            cvv: compra.cvv,
            created_at: compra.created_at,
            pagado: compra.pagado,
    }.to_json
    else
        { error: 'Error al confirmar el pago' }.to_json
    end

end