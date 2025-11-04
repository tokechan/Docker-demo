FROM node:20-alpine

WORKDIR /app

COPY docker/frontend/entrypoint.sh /usr/local/bin/frontend-entrypoint.sh
RUN chmod +x /usr/local/bin/frontend-entrypoint.sh

ENTRYPOINT ["frontend-entrypoint.sh"]

EXPOSE 5173
