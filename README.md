# PrepSphere

Full-stack mock interview platform:
- Frontend: React + Vite
- Backend: Spring Boot
- Database: MySQL
- Deployment: Docker + Linux server + GitHub Actions CI/CD

## Local Run

### 1) Frontend
```bash
npm ci
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 2) Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

## Remove Admin Mode

Project is now single-role (`USER`) and ADMIN-specific access has been removed from code paths.

## CI/CD

### CI workflow
File: `.github/workflows/ci.yml`
- Frontend build (`npm ci`, `npm run build`)
- Backend compile (`mvn -q -DskipTests compile`)

### CD workflow
File: `.github/workflows/cd.yml`
- Build Docker images for frontend/backend
- Push images to GHCR
- SSH deploy to Linux server using `docker compose`

## Required GitHub Secrets

Add these secrets in your GitHub repo settings:

- `SERVER_HOST`
- `SERVER_PORT` (optional, default `22`)
- `SERVER_USER`
- `SERVER_SSH_KEY`
- `GHCR_USERNAME`
- `GHCR_TOKEN` (PAT with `read:packages` and `write:packages`)
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `APP_JWT_SECRET`
- `APP_JWT_EXPIRATION_MS`

## Linux Server Prerequisites

Install Docker + Docker Compose plugin:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

## Create and Push GitHub Repository

Run these in project root:
```bash
git init
git add .
git commit -m "Initial PrepSphere setup with CI/CD and MySQL deployment"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

After push, CI runs automatically. On `main` push, CD also runs and deploys to your Linux server.
# PrepSphere
