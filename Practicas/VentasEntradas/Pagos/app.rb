require 'sinatra'
require 'sinatra/activerecord'
require 'json'
# require 'mongo'
# require 'mongoid'
require './models/compras'

# client = Mongo::Client.new(['mongo:27017'], database: 'eventos_db')
# collection_eventos = client[:eventos]
# collection_compras = client[:compras]

set :database_file, 'config/database.yml'

get '/' do
    content_type :json
    { message: 'Bienvenido a la API de eventos' }.to_json
end

# compra de entradas
post '/comprar_entradas' do
    content_type :json
    request.body.rewind
    data = JSON.parse(request.body.read)
    
    # if data['id_evento'].nil? || data['nombre_evento'].nil? || data['precio_evento'].nil? || data['cantidad'].nil?
    #     return { error: 'Faltan datos requeridos' }.to_json
    # end
    # if data['cantidad'] <= 0
    #     return { error: 'La cantidad debe ser mayor a 0' }.to_json
    # end
    # if data['cantidad'] % 1 != 0
    #     return { error: 'La cantidad debe ser un número entero' }.to_json
    # end

    # event_id = data['id_evento']
    # event_name = data['nombre_evento']
    # event_price = data['precio_evento']
    # quantity = data['cantidad']
    # total_price = event_price * quantity

    # collection_compras.insert_one(
    #     {
    #         # crea un id unico para cada compra
    #         _id: BSON::ObjectId.new,
    #         event_id: event_id,
    #         event_name: event_name,
    #         event_price: event_price,
    #         quantity: quantity,
    #         total_price: total_price,
    #         created_at: Time.now,
    #         pagado: false
    #     }
    # )

    # { message: 'se realizó la solicitud de pago..', event_id: event_id, event_name: event_name, event_price: event_price, quantity: quantity, total: total_price }.to_json

    compra = Compras.new(
        id_evento: data['id_evento'],
        nombre_evento: data['nombre_evento'],
        precio_evento: data['precio_evento'],
        cantidad: data['cantidad'],
        total: data['precio_evento'] * data['cantidad'],
        created_at: Time.now,
        pagado: false
    )
    if compra.save
        { message: 'se realizó la solicitud de pago..', event_id: compra.id_evento, event_name: compra.nombre_evento, event_price: compra.precio_evento, quantity: compra.cantidad, total: compra.total }.to_json
    else
        { error: 'Error al realizar la compra' }.to_json
    end
    

end

# confirmacion de pagos
post '/confirmar_pago' do
    content_type :json
    request.body.rewind
    data = JSON.parse(request.body.read)

    # id_compra = data['id_compra']
    # compra = collection_compras.find(_id: BSON::ObjectId(id_compra)).first
    # if compra.nil?
    #     return { error: 'Compra no encontrada' }.to_json
    # end
    # if compra['pagado']
    #     return { error: 'La compra ya fue pagada' }.to_json
    # end

    # # Actualiza el estado de la compra a pagado
    # collection_compras.update_one(
    #     { _id: BSON::ObjectId(id_compra) },
    #     { '$set' => { pagado: true } }
    # )

    # { message: 'Pago confirmado', event_id: event_id, quantity: quantity }.to_json

    compra = Compras.find_by(id_compra: data['id_compra'])
    if compra.nil?
        return { error: 'Compra no encontrada' }.to_json
    end
    if compra.pagado
        return { error: 'La compra ya fue pagada' }.to_json
    end
    # Actualiza el estado de la compra a pagado
    compra.pagado = true
    if compra.save
        { message: 'Pago confirmado', event_id: compra.id_evento, quantity: compra.cantidad }.to_json
    else
        { error: 'Error al confirmar el pago' }.to_json
    end

end

post '/notificar_pago' do
    content_type :json
    request.body.rewind
    data = JSON.parse(request.body.read)

    # llamar al endpoint de la notificacion mediante correo

end