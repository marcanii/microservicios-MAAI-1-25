# Usar una imagen base de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /ejercicio1

# Copiar los archivos necesarios al contenedor
COPY package.json .
COPY package-lock.json .

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Crear las carpetas uploads y logs si no existen


# Exponer el puerto 4001
EXPOSE 4001

# Comando para iniciar el servidor
CMD ["node", "app.js"]