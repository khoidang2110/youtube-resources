FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN rm -rf node_modules && npm install

COPY . .

EXPOSE 4000

CMD ["node", "src/view/app.js"]
