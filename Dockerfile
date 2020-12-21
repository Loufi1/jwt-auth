FROM node:12

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "index.js"]