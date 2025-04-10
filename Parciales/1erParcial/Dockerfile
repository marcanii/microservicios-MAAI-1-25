FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /libros

# Copiar los archivos necesarios al contenedor
COPY package.json .
COPY package-lock.json .

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto 3030
EXPOSE 3030

# Comando para iniciar el servidor
CMD ["node", "server.js"]
