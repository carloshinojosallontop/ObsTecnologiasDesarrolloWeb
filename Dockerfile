# Usa una imagen oficial de Node.js
FROM node:16

# Crea el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que la aplicación se ejecuta (3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "app.js" ]
