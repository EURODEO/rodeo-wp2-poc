FROM node:18-alpine

WORKDIR /app

COPY package.json ./

ARG UI_BASE_PATH
ENV UI_BASE_PATH $UI_BASE_PATH

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]