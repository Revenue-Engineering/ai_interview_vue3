# Use Node.js Alpine for a small image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and lock file first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# Expose Vite's preview port (default 4173)
EXPOSE 4173

# Run Vite preview in production mode
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
