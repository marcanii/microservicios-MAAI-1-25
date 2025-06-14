from flask import Flask, jsonify, request
import psycopg2
import os
from functools import wraps
import jwt
from datetime import datetime, date, time, timedelta
import logging
import pika
from psycopg2.extras import RealDictCursor
import json

app = Flask(__name__)
logging.basicConfig(
    level=logging.INFO,  # Puedes usar DEBUG, INFO, WARNING, ERROR, CRITICAL
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("logs/servicio-reservas.log"),  # Guarda logs en un archivo
        logging.StreamHandler()          # También imprime en consola
    ]
)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'mi_secret_jwt')

DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_NAME = os.environ.get('DB_NAME', 'bd_citas_medicas')
DB_USER = os.environ.get('DB_USER', 'postgres')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'admin')
DB_PORT = os.environ.get('DB_PORT', '5432')

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': '¡No autorizado!'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            logging.warning(f"Token expirado: Usuario={request.current_user.get('correo', 'desconocido')}, IP={request.remote_addr}")
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            logging.error(f"Token inválido: Usuario={request.current_user.get('correo', 'desconocido')}, IP={request.remote_addr}")
            return jsonify({'error': 'Token inválido'}), 401

        return f(*args, **kwargs)
    return decorated

def enviar_mensaje_a_cola(payload: dict):
    try:
        print("[*] Conectando a RabbitMQ...")
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host='rabbitmq',  # Usa 'localhost' si es fuera de Docker
                credentials=pika.PlainCredentials('admin', 'admin'),
                heartbeat=600,  # Para evitar timeouts
                blocked_connection_timeout=300,
            )
        )
        print("[+] Conexión establecida con RabbitMQ.")

        channel = connection.channel()
        print("[*] Canal creado.")

        channel.queue_declare(queue='notificaciones_queue', durable=False)
        print("[+] Cola 'notificaciones_queue' declarada.")

        mensaje = json.dumps(payload)
        channel.basic_publish(
            exchange='',
            routing_key='notificaciones_queue',
            body=mensaje,
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print("[✔] Mensaje enviado:", mensaje)

        connection.close()
        print("[*] Conexión cerrada.")

    except Exception as e:
        logging.error(f"[!] Error al enviar mensaje a RabbitMQ: {e}")

@app.route('/api/reservas', methods=['POST'])
@token_required
def crear_reserva():
    data = request.get_json()
    paciente_id = data.get('paciente_id')
    medico_id = data.get('medico_id')
    especialidad_id = data.get('especialidad_id')
    rol = data.get('rol', 'paciente')
    fecha = data.get('fecha')
    hora_inicio_str = data.get('hora')

    try:
        # Parsear la hora y calcular hora_fin (1 hora después)
        hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time()
        hora_fin = (datetime.combine(datetime.today(), hora_inicio) + timedelta(hours=1)).time()

        conn = get_db_connection()
        cur = conn.cursor()

        # Validar disponibilidad (solapamiento)
        cur.execute('''
            SELECT COUNT(*) FROM reservas
            WHERE medico_id = %s AND fecha = %s
            AND (
                (hora_inicio < %s AND hora_fin > %s) OR
                (hora_inicio >= %s AND hora_inicio < %s)
            )
        ''', (medico_id, fecha, hora_fin, hora_inicio, hora_inicio, hora_fin))
        count = cur.fetchone()[0]

        if count > 0:
            return jsonify({'error': 'El médico no está disponible en ese horario'}), 409

        # Insertar nueva reserva
        cur.execute('''
            INSERT INTO reservas (paciente_id, medico_id, especialidad_id, fecha, hora_inicio, hora_fin)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (paciente_id, medico_id, especialidad_id, fecha, hora_inicio, hora_fin))
        conn.commit()

        cur.close()
        conn.close()
        logging.info(f"Reserva creada: Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Crear Reserva")
        payload = {
            'paciente_id': paciente_id,
            'medico_id': medico_id,
            'rol': rol,
            'accion': 'crear_reserva',
            'mensaje': f'Reserva creada para el médico {medico_id} el {fecha} de {hora_inicio_str} a {hora_fin.strftime("%H:%M")}',
        }
        enviar_mensaje_a_cola(payload)
        return jsonify({
            'message': 'Reserva creada exitosamente',
            'data': {
                'paciente_id': paciente_id,
                'medico_id': medico_id,
                'especialidad_id': especialidad_id,
                'fecha': fecha,
                'hora_inicio': hora_inicio.strftime("%H:%M"),
                'hora_fin': hora_fin.strftime("%H:%M")
            }
        })

    except Exception as e:
        logging.error(f"Error al crear reserva: {str(e)}, Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Crear Reserva")
        return jsonify({'error': str(e)}), 500

@app.route('/api/reservas/<int:id>', methods=['PATCH'])
@token_required
def editar_reserva(id):
    data = request.get_json()
    paciente_id = data.get('paciente_id')
    medico_id = data.get('medico_id')
    especialidad_id = data.get('especialidad_id')
    fecha = data.get('fecha')
    hora_inicio_str = data.get('hora')

    try:
        hora_inicio = datetime.strptime(hora_inicio_str, "%H:%M").time()
        hora_fin = (datetime.combine(datetime.today(), hora_inicio) + timedelta(hours=1)).time()

        conn = get_db_connection()
        cur = conn.cursor()

        # Verificar disponibilidad excluyendo la reserva actual
        cur.execute('''
            SELECT COUNT(*) FROM reservas
            WHERE medico_id = %s AND fecha = %s AND id != %s
            AND (
                (hora_inicio < %s AND hora_fin > %s) OR
                (hora_inicio >= %s AND hora_inicio < %s)
            )
        ''', (medico_id, fecha, id, hora_fin, hora_inicio, hora_inicio, hora_fin))
        count = cur.fetchone()[0]

        if count > 0:
            return jsonify({'error': 'El médico no está disponible en ese horario'}), 409

        # Actualizar reserva
        cur.execute('''
            UPDATE reservas
            SET paciente_id = %s, medico_id = %s, especialidad_id = %s,
                fecha = %s, hora_inicio = %s, hora_fin = %s
            WHERE id = %s
        ''', (paciente_id, medico_id, especialidad_id, fecha, hora_inicio, hora_fin, id))
        conn.commit()

        cur.close()
        conn.close()
        logging.info(f"Reserva actualizada: Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Editar Reserva, ID={id}")
        return jsonify({
            'message': 'Reserva actualizada exitosamente',
            'data': {
                'id': id,
                'paciente_id': paciente_id,
                'medico_id': medico_id,
                'especialidad_id': especialidad_id,
                'fecha': fecha,
                'hora_inicio': hora_inicio.strftime("%H:%M"),
                'hora_fin': hora_fin.strftime("%H:%M")
            }
        })

    except Exception as e:
        logging.error(f"Error al editar reserva: {str(e)}, Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Editar Reserva, ID={id}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/reservas/<int:reserva_id>', methods=['DELETE'])
@token_required
def cancelar_reserva(reserva_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Obtener datos de la reserva
        cur.execute('SELECT * FROM reservas WHERE id = %s', (reserva_id,))
        reserva = cur.fetchone()

        cur.execute('DELETE FROM reservas WHERE id = %s', (reserva_id,))
        conn.commit()

        cur.close()
        conn.close()

        logging.info(f"Reserva cancelada: Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Cancelar Reserva, ID={reserva_id}")

        payload = {
            'medico_id': reserva['medico_id'],
            'paciente_id': reserva['paciente_id'],
            'rol': reserva.get('rol', 'paciente'),
            'accion': 'cancelar_reserva',
            'mensaje': f'Reserva cancelada para el médico {reserva["medico_id"]} el {reserva["fecha"]} de {reserva["hora_inicio"]} a {reserva["hora_fin"]}',
        }
        enviar_mensaje_a_cola(payload)

        return jsonify({'message': 'Reserva cancelada'})

    except Exception as e:
        logging.error(f"Error al cancelar reserva: {str(e)}, Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Cancelar Reserva, ID={reserva_id}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/reservas', methods=['GET'])
@token_required
def obtener_reservas():
    try:
        usuario_id = request.args.get('usuario_id')
        medico_id = request.args.get('medico_id')

        conn = get_db_connection()
        cur = conn.cursor()

        query = 'SELECT * FROM reservas'
        conditions = []
        params = []

        if usuario_id:
            conditions.append('paciente_id = %s')
            params.append(usuario_id)
        
        if medico_id:
            conditions.append('medico_id = %s')
            params.append(medico_id)

        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)

        query += ' ORDER BY fecha, hora_inicio'
        cur.execute(query, params)

        reservas = cur.fetchall()
        cur.close()
        conn.close()

        columnas = ['id', 'paciente_id', 'medico_id', 'especialidad_id', 'fecha', 'hora_inicio', 'hora_fin']
        reservas_dict = []

        for r in reservas:
            reserva = dict(zip(columnas, r))
            reserva['fecha'] = reserva['fecha'].strftime("%Y-%m-%d") if isinstance(reserva['fecha'], (datetime, date)) else str(reserva['fecha'])
            reserva['hora_inicio'] = reserva['hora_inicio'].strftime("%H:%M") if isinstance(reserva['hora_inicio'], time) else str(reserva['hora_inicio'])
            reserva['hora_fin'] = reserva['hora_fin'].strftime("%H:%M") if isinstance(reserva['hora_fin'], time) else str(reserva['hora_fin'])
            reservas_dict.append(reserva)

        logging.info(f"Reservas obtenidas: Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Obtener Reservas")
        return jsonify(reservas_dict)

    except Exception as e:
        logging.error(f"Error al obtener reservas: {str(e)}, Usuario={request.current_user['correo']}, IP={request.remote_addr}, Acción=Obtener Reservas")
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
