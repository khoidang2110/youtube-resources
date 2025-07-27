# Use Node.js LTS version
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port Express uses
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
