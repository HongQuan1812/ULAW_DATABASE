FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    python3-dev \
    graphviz \
    libgraphviz-dev \
    pkg-config \
    libssl-dev \
    libffi-dev \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (to leverage Docker cache)
COPY Database_Services/Config/python_config/requirements.txt ./Config/python_config/requirements.txt

# Upgrade pip and install Python deps
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r ./Config/python_config/requirements.txt

# Copy the rest of your project code
COPY Database_Services .

# Expose FastAPI port
EXPOSE 8000