ARG NODE_VERSION=26
ARG NGINX_VERSION=stable-alpine

# ---------- Install dependency ----------
FROM node:${NODE_VERSION}-slim AS deps
WORKDIR /app
RUN chown -R node:node /app
COPY --chown=node:node package*.json ./
USER node
RUN npm i --legacy-peer-deps

FROM deps AS development
COPY --chown=node:node . .
EXPOSE 5173
CMD [ "sh", "-c", "npm run dev -- --host" ]

# ---------- Build Vue ----------
FROM deps AS builder
ARG BUILD_MODE=development
ARG VITE_APP_API
ARG VITE_ADMIN_EMAIL
ARG VITE_ADMIN_WHATSAPP
# Variabel VITE_* ditanam saat build
ENV VITE_APP_API=${VITE_APP_API} \
    VITE_ADMIN_EMAIL=${VITE_ADMIN_EMAIL} \
    VITE_ADMIN_WHATSAPP=${VITE_ADMIN_WHATSAPP} \
    NODE_OPTIONS=--max-old-space-size=1024
COPY . .
RUN npm run build -- --mode ${BUILD_MODE}

# ---------- Serve dengan Nginx ----------
FROM nginx:${NGINX_VERSION} AS serve
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
