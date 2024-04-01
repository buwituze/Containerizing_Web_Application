# Use a lightweight HTTP server to serve static files
FROM node:alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the HTML, CSS, and JS files to the working directory
COPY index.html .
COPY Js ./Js
COPY CSS ./CSS

# Install http-server
RUN npm install --save-dev http-server

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the HTTP server
CMD ["npx", "http-server", "-p", "3000"]