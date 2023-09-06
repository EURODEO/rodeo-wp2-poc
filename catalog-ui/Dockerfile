FROM node:18-alpine

WORKDIR /app

COPY . .

ARG ELASTICSEARCH_URL
ENV ELASTICSEARCH_URL $ELASTICSEARCH_URL

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]