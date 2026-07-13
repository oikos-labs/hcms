# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /app

ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

RUN test -n "$EXPO_PUBLIC_API_URL"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/api-types/package.json ./packages/api-types/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter mobile exec expo export --platform web


FROM nginx:stable-alpine AS runner

COPY apps/mobile/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/apps/mobile/dist /usr/share/nginx/html

ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider "http://localhost:${PORT}/" || exit 1

CMD ["nginx", "-g", "daemon off;"]
