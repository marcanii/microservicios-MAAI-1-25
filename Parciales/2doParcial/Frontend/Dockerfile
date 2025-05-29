# Usa una imagen base de Node.js para servir archivos estáticos
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del frontend
COPY . .

# Instala http-server para servir archivos estáticos
RUN npm install -g http-server

# Expone el puerto 3000
EXPOSE 3000

# Comando para ejecutar el servidor
CMD ["http-server", "-p", "3000", "-c-1", "--cors"]