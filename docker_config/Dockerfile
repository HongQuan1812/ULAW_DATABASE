FROM debian:bullseye-slim

WORKDIR /app

# Install system dependencies for Node.js and native builds
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install NVM
ENV NVM_DIR=/usr/local/nvm
RUN mkdir -p $NVM_DIR
# Define versions as environment variables for clarity & reusability
ENV NVM_VERSION=0.40.3
ENV NODE_VERSION=16.20.0
ENV NPM_VERSION=8.19.4

# Install NVM, Node.js, and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install ${NODE_VERSION} \
    && nvm use ${NODE_VERSION} \
    && nvm alias default ${NODE_VERSION} \
    && npm install -g npm@${NPM_VERSION}

# Make node and npm available in PATH
ENV NODE_PATH=$NVM_DIR/versions/node/v${NODE_VERSION}/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v${NODE_VERSION}/bin:$PATH

# Copy package files first (to leverage cache)
COPY Frontend_Services/package*.json ./

# Install dependencies and Clean up npm cache after install (reduce image size):
RUN npm install && npm cache clean --force

# Copy the rest of your project
COPY Frontend_Services ./

# Expose the frontend dev server port (adjust if your framework uses another)
EXPOSE 3000
