# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY index.js .
COPY app.js .
COPY connection ./connection
COPY controller ./controller
COPY routes ./routes
COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 4000

CMD ["node", "index.js"]
