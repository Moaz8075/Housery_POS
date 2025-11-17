FROM node:18

# Create working directory
WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Expose your backend port
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
