#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${FRONT_IMAGE:-}" || -z "${BACK_IMAGE:-}" ]]; then
  echo "FRONT_IMAGE and BACK_IMAGE must be set"
  exit 1
fi

if [[ -z "${MYSQL_ROOT_PASSWORD:-}" || -z "${MYSQL_PASSWORD:-}" || -z "${APP_JWT_SECRET:-}" ]]; then
  echo "MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, and APP_JWT_SECRET must be set"
  exit 1
fi

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker image prune -f
