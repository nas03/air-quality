# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g node-gyp
RUN npm install argon2

# Copy the entire application code
COPY . .
COPY production.env .
# Copy environment variables


# Build the application
RUN npm run build

# Expose the application port
EXPOSE 5500

# Start the application
CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]