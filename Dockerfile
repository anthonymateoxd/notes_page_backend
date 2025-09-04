FROM node:18-alpine

WORKDIR /app

COPY index.js .
COPY app.js .
COPY config.js .
COPY package.json .
COPY connection ./connection
COPY controllers ./controllers
COPY routes ./routes
COPY middleware ./middleware
COPY libs ./libs
COPY db ./db

RUN npm install

EXPOSE 4000

CMD ["node", "index.js"]
