FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g node-gyp
RUN npm install argon2

COPY . .

RUN npm run build

EXPOSE 443

CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]