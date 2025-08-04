# Use an official Node image
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
# Copy the rest of the application code in production mode 
COPY . .
# Build the frontend
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
