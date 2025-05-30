# Use an official Node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the development server port (usually 3000)
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
