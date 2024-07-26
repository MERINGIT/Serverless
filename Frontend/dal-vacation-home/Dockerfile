# Step 1: Use an official node image as a base image
FROM node:18-alpine AS build
 
# Set environment variables
ENV PORT 8080
ENV HOST 0.0.0.0
 
# Step 2: Set the working directory
WORKDIR /app
 
# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./
 
# Step 4: Install dependencies
RUN npm install
 
# Step 5: Copy the rest of the application
COPY . .
 
# Step 6: Build the application
RUN npm run build
 
# Step 7: Install `serve` to run the application
RUN npm install -g serve
 
# Expose port 8080 to allow communication to/from container
EXPOSE 8080
 
# Command to run the application
CMD ["serve", "-s", "build", "-l", "8080"]
 