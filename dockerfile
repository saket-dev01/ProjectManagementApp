# Use official Node.js image with Alpine 3.18 (which has OpenSSL 1.1)
FROM node:20-alpine3.18

# Install required dependencies

# Set working directory
WORKDIR /app 

# Copy package files
COPY package.json package-lock.json ./

# Copy Prisma schema before installing dependencies
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
