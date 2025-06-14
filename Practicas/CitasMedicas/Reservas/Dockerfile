FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para MySQL
RUN apt-get update && \
    apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && \
    rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar el cache de Docker
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear usuario no-root para seguridad
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Exponer el puerto
EXPOSE 4000

# Script de inicio que arregla permisos y ejecuta la app
CMD ["sh", "-c", "mkdir -p /app/logs && chmod -R 777 /app/logs && chown -R appuser:appuser /app && su appuser -c 'gunicorn --bind 0.0.0.0:4000 --workers 4 src.app:app'"]