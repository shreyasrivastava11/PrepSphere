# PrepSphere Backend

## Run
- `cd backend`
- `mvn spring-boot:run`

## Database (PostgreSQL)
- App is configured for PostgreSQL.
- Config can be set via env vars:
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `APP_JWT_SECRET`
  - `APP_JWT_EXPIRATION_MS`

## Auth Endpoints
- `POST /api/auth/register-user`
- `POST /api/auth/login`

## Question Endpoints
- `GET /api/questions?category=&difficulty=&page=0&size=10`
- `POST /api/questions` (authenticated user)
- `PUT /api/questions/{id}` (authenticated user)
- `DELETE /api/questions/{id}` (authenticated user)

## Test Endpoints
- `POST /api/tests/start` (authenticated user)
- `POST /api/tests/{attemptId}/submit` (authenticated user)
- `GET /api/tests/history` (authenticated user)
- `GET /api/tests/best-score` (authenticated user)
- `GET /api/tests/analytics` (authenticated user)

## Roles
- `USER`: take tests, view progress, and manage questions.

## Notes
