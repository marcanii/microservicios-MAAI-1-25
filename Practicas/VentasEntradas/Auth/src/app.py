import MySQLdb.cursors
from flask import Flask, render_template,jsonify, request
from flask_mysqldb import MySQL
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps 
import os

app = Flask(__name__) 

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'cb2e2dedeef58d11183f2aa2f769abf5255298225403f80322f3bcfe54a41aa3')

app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD', 'seykos')
app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB', 'DB_usuarios')
# Lista blanca para tokens válidos (en producción usa Redis o DB)
active_tokens = set()

mysql = MySQL(app)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token no proporcionado'}), 401
            
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            
            # Verificar si el token está en la lista blanca
            if token not in active_tokens:
                return jsonify({'error': 'Token inválido (sesión cerrada)'}), 401
                
            # Añadir el payload al contexto de la solicitud
            request.current_user = payload
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
            
        return f(*args, **kwargs)
    return decorated



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/auth/register', methods=['POST'])
def registro():
    data = request.get_json()
    nombre = data['nombre']
    password = data['contrasena']
    rol = data.get('rol', 'user')
    email = data['email']
    if rol not in ['admin', 'user']:
        return jsonify({'error': 'Rol inválido'}), 400
    if not nombre or not password:
        return jsonify({"error": "Faltan username o password"}), 400
    Contrasena = hash_password(password)
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (%s, %s, %s, %s)", (nombre, email, Contrasena, rol))  
    cursor.connection.commit()
    cursor.close()
    return jsonify({'mensaje': 'Usuario registrado exitosamente'}), 201



@app.route('/api/auth/login', methods=['POST'])
def login():
    # 1. Validar datos de entrada
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos JSON requeridos"}), 400

    email = data.get('email')
    contrasena = data.get('contrasena')

    if not email or not contrasena:
        return jsonify({"error": "Nombre y contraseña son requeridos"}), 400

    # 2. Buscar usuario en la base de datos
    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(
            "SELECT id, email, contrasena, rol FROM usuarios WHERE email = %s", 
            (email,)
        )
        usuario_db = cursor.fetchone()
        cursor.close()

        print(usuario_db)
        
        if not usuario_db:
            return jsonify({'error': 'Credenciales inválidas'}), 401

        # 3. Verificar contraseña
        if isinstance(usuario_db['contrasena'], str):
            hash_guardado = usuario_db['contrasena'].encode('utf-8')
        else:
            hash_guardado = usuario_db['contrasena']

        if not bcrypt.checkpw(contrasena.encode('utf-8'), hash_guardado):
            return jsonify({'error': 'Credenciales inválidas'}), 401

        # 4. Generar token JWT
        token_payload = {
            'sub': usuario_db['id'],
            'email': usuario_db['email'],
            'rol': usuario_db.get('rol', 'user'),  # Valor por defecto si no existe
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }

        token = jwt.encode(
            token_payload,
            app.config['SECRET_KEY'],
            algorithm='HS256'
        )  # Convertir a string
        active_tokens.add(token)
        # 5. Retornar respuesta
        return jsonify({
            'access_token': token,
            'token_type': 'bearer',
            'expires_in': 1800,
            'user': {
                'id': usuario_db['id'],
                'email': usuario_db['email'],
                'rol': usuario_db.get('rol', 'user')
            }
        }), 200

    except Exception as e:
        print(f"Error en login: {str(e)}")  # Log para debugging
        return jsonify({'error': 'Error en el servidor'}), 500
    
@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # Obtener el token del header Authorization
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Token no proporcionado'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Verificar y decodificar el token
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        
        # Invalidar el token añadiéndolo a la lista negra
        active_tokens.discard(token)  # Eliminar si existe
        
        return jsonify({'mensaje': 'Sesión cerrada exitosamente'}), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token ya expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token inválido'}), 401


def hash_password(password):
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')




if __name__ == "__main__":
    app.run(debug=True)