# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build the Next.js application
COPY . .
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Set the command to start the Next.js application
CMD ["npm", "start"]
