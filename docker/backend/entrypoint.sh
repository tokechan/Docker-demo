#!/bin/sh
set -e

APP_DIR=/var/www/html
DB_HOST=${DB_HOST:-mysql}
DB_PORT=${DB_PORT:-3306}

cd "$APP_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
fi

composer install --no-interaction --prefer-dist

php artisan key:generate --force

echo "Waiting for database ${DB_HOST}:${DB_PORT}..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

php artisan migrate --force

exec php artisan serve --host=0.0.0.0 --port=8787
