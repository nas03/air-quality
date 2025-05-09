FROM node:20

WORKDIR /app

COPY package*.json ./

# Combine dependency installation into a single layer for better caching
RUN npm install && \
    npm install -g node-gyp && \
    npm install argon2

COPY . .

RUN npm run build

EXPOSE 443

CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]