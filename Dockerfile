FROM node:16-alpine

WORKDIR /api

RUN apk update && apk add --no-cache pdftk

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

COPY package.json yarn.lock build/

EXPOSE 4000

ENTRYPOINT [ "node",  "build/start.js", "4000" ]