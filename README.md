# PrepSphere

PrepSphere is a full-stack mock interview platform.

- Frontend: React + Vite
- Backend: Spring Boot
- Database: MySQL
- Deployment: Render

## Local Run

### Frontend
```bash
npm ci
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

## Render Deployment

Create 2 Render services from this repository.

### Backend (Web Service)
- Runtime: Java
- Root Directory: `backend`
- Build Command: `mvn -DskipTests package`
- Start Command: `java -jar target/*.jar`

Environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`
- `APP_JWT_EXPIRATION_MS` (example `86400000`)

### Frontend (Static Site)
- Root Directory: `.`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

Environment variable:
- `VITE_API_BASE_URL` = your backend Render URL (example `https://prepsphere-backend.onrender.com`)

## Notes

- Admin mode removed (single user role flow).
- Backend CORS allows localhost and `*.onrender.com`.
- CI workflow is in `.github/workflows/ci.yml`.
