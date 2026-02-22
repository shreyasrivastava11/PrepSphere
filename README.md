# PrepSphere 🚀

PrepSphere is a full-stack mock interview preparation platform that allows users to practice technical interviews and improve their performance through structured question flows.

The project follows modern DevOps practices including Dockerized deployment, GitHub Actions CI/CD, and automated Linux server deployment.

---

## 🛠 Tech Stack

- **Frontend:** React + Vite
- **Backend:** Spring Boot
- **Database:** MySQL
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment:** Linux Server (Docker Compose)
- **Container Registry:** GitHub Container Registry (GHCR)

---

## 🏗 Architecture Overview

- React frontend communicates with Spring Boot REST APIs.
- Spring Boot connects to a MySQL database.
- Docker containers manage frontend, backend, and database services.
- GitHub Actions handles:
  - Continuous Integration (build & verification)
  - Continuous Deployment (automated server deployment)
- Deployment occurs via SSH to a Linux server using Docker Compose.

---

## 🚀 Local Development Setup

### 1️⃣ Frontend

```bash
npm ci
npm run dev
```

Runs at:  
http://localhost:5173

---

### 2️⃣ Backend

```bash
cd backend
mvn spring-boot:run
```

Runs at:  
http://localhost:8080

---

## 🔐 Authentication & Roles

The project currently operates in **single-role mode (USER)**.  
All ADMIN-specific access and code paths have been removed to simplify deployment and security.

---

## ⚙️ CI/CD Configuration

### ✅ Continuous Integration (CI)

File: `.github/workflows/ci.yml`

Workflow includes:

- Frontend build:
  ```bash
  npm ci
  npm run build
  ```

- Backend compile:
  ```bash
  mvn -q -DskipTests compile
  ```

CI runs automatically on every push and pull request.

---

### 🚀 Continuous Deployment (CD)

File: `.github/workflows/cd.yml`

On push to `main` branch:

- Builds Docker images for frontend and backend
- Pushes images to GitHub Container Registry (GHCR)
- Connects to Linux server via SSH
- Deploys containers using Docker Compose

---

## 🔑 Required GitHub Secrets

Configure the following secrets in:

**GitHub → Repository → Settings → Secrets and Variables → Actions**

```
SERVER_HOST
SERVER_PORT (optional, default 22)
SERVER_USER
SERVER_SSH_KEY
GHCR_USERNAME
GHCR_TOKEN
MYSQL_ROOT_PASSWORD
MYSQL_DATABASE
MYSQL_USER
MYSQL_PASSWORD
APP_JWT_SECRET
APP_JWT_EXPIRATION_MS
```

> `GHCR_TOKEN` must have:
> - read:packages  
> - write:packages  

---

## 🖥 Linux Server Prerequisites

Install Docker and Docker Compose plugin:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

Ensure the server user has Docker permissions.

---

## 📦 Initial Repository Setup

Run the following in the project root:

```bash
git init
git add .
git commit -m "Initial PrepSphere setup with CI/CD and MySQL deployment"
git branch -M main
git remote add origin https://github.com/<shreyasrivastava11>/<PrepSphere>.git
git push -u origin main
```

After pushing:
- CI runs automatically.
- On push to `main`, CD deploys to your Linux server.

---

## 🔮 Future Improvements

- Add AI-based interview evaluation
- Add performance analytics dashboard
- Add email notifications
- Reintroduce role-based access with secure admin panel
- Add unit & integration test coverage

---

## 👩‍💻 Author

Shreya Srivastava  
Full-Stack Developer

---

