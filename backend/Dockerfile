FROM node:22-slim

WORKDIR /app

# Install dependencies for building native modules (sqlite3, msnodesqlv8)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --omit=dev --no-warnings

# Copy application source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
