# Use a lightweight Node.js image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the application code from the JS directory to the working directory
COPY Js/index.js .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]