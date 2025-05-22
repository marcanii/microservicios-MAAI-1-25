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


mysql = MySQL(app)


def token_requerido(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token faltante'}), 401

        try:
            # Si el token viene como 'Bearer <token>', lo separamos
            token = token.split()[1] if ' ' in token else token
            datos = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except Exception as e:
            return jsonify({'error': 'Token inválido o expirado'}), 401

        return f(*args, **kwargs)

    return decorador



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
    



def hash_password(password):
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')




if __name__ == "__main__":
    app.run(debug=True)