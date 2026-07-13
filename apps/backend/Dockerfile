# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /app


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/api-types/package.json ./packages/api-types/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json

RUN pnpm install --frozen-lockfile


FROM dependencies AS builder

COPY . .

RUN pnpm --filter backend prisma:generate \
    && pnpm --filter backend build


FROM base AS production-dependencies

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/api-types/package.json ./packages/api-types/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json

RUN pnpm install --prod --frozen-lockfile --filter backend... --ignore-scripts


FROM production-dependencies AS migration

ENV NODE_ENV=production

WORKDIR /app/apps/backend

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/prisma.config.ts ./prisma.config.ts

CMD ["pnpm", "prisma", "migrate", "deploy"]


FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=production-dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

EXPOSE 8080

CMD ["node", "apps/backend/dist/src/main.js"]
