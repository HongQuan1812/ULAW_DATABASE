# ULAW_DATABASE

This project provides a database service managed with Docker Compose.

---

## 📦 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your system  
- Project root directory: `ULAW_DATABASE`


## 🚀 Running the Server

1. Open a terminal and navigate to the main directory:

   ```bash
   cd ULAW_DATABASE
   ```

2. Start the server using Docker Compose:

    ```bash
    docker compose -f Config/docker_config/docker-compose.yml up --build -d
    ```

    - `--build` ensures the image is rebuilt when there are changes in your code.
    - If there are no code changes, you can omit `--build` for a faster startup


## 🛑 Stopping the Server
- To stop and remove all containers, networks, and volumes created by Docker Compose:

    ```bash
    docker compose -f Config/docker_config/docker-compose.yml down
    ```


