# Usar una imagen base de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /Especialidades

# Copiar los archivos necesarios al contenedor
COPY package.json .
COPY package-lock.json .

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Crear las carpetas uploads y logs si no existen


# Exponer el puerto 5000
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "src/server.js"]