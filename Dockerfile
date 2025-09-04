# backend/Dockerfile

FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de definición del proyecto
COPY package.json ./
COPY package-lock.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del backend
COPY index.js ./
COPY app.js ./
COPY config.js ./
COPY .env.template ./
COPY .gitignore ./
COPY Dockerfile ./

# Copiar todos los directorios relevantes
COPY connection ./connection
COPY controllers ./controllers
COPY db ./db
COPY libs ./libs
COPY middleware ./middleware
COPY routes ./routes

# Exponer el puerto que usa la aplicación
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
