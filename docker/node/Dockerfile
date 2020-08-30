FROM node:14.9-alpine

# add bash
RUN apk update
RUN apk upgrade
RUN apk add bash

WORKDIR /app

COPY ./wait-for-it.sh /usr/local

RUN chmod +x /usr/local/wait-for-it.sh

CMD ["sh","-c","ls && /usr/local/wait-for-it.sh kafka:9092 && npm install && npm run nodemon "]