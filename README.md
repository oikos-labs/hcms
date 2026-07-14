# House Church Management System

<br />

<p align="center">
  <img width="125" alt="HCMS" src="./apps/mobile/assets/images/icon.png" />
  <div align="center">A House Church Management System monorepo.</div>
</p>

#

## Overview

House Church Management System is currently scaffolded as a TypeScript monorepo for a mobile app, backend API, and shared packages.

The current project pairs an Expo mobile app with a NestJS backend. It also includes shared workspace packages for API types and reusable TypeScript configuration. The mobile app currently renders a basic `HCMS` home screen, and the backend currently starts an empty Nest application module.

<br />

> [!NOTE]
> This repository is still in its initial scaffold stage. The Expo and NestJS boilerplate has been reduced, but product-specific HCMS features have not been implemented yet.

<br />

## Current Scope

- Expo Router mobile app in `apps/mobile`.
- NestJS backend app in `apps/backend`.
- Shared API types package in `packages/api-types`.
- Shared TypeScript configuration package in `packages/tsconfig`.
- Turborepo task orchestration across workspace packages.
- Jest setup for mobile component tests.
- Playwright setup for web end-to-end checks against the Expo web export.
- Maestro flow setup for mobile end-to-end checks.

<br />

## Tech Stack

**Mobile**

![Expo](https://img.shields.io/badge/Expo_56-000020?style=for-the-badge&logo=expo&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Native](https://img.shields.io/badge/React_Native_0.85-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=for-the-badge&logo=expo&logoColor=white)

**Backend**

![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**Tooling And Tests**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm_10-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo_2-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Maestro](https://img.shields.io/badge/Maestro-111827?style=for-the-badge)

<br />

## Project Structure

```txt
apps/
  backend/              NestJS backend application
  mobile/               Expo Router mobile application
    app/                App routes and layouts
    assets/images/      App icon, adaptive icon, favicon, and splash assets
    __tests__/          Jest tests for the mobile app
    e2e/maestro/        Maestro mobile E2E flows
e2e/web/                Playwright web E2E tests
packages/
  api-types/            Shared API type exports
  tsconfig/             Shared TypeScript base, Expo, and Nest configs
scripts/                Project helper scripts
```

<br />

## Apps

### Mobile

The mobile app is an Expo SDK 56 app using Expo Router. It currently has a root layout and a single home route:

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/index.tsx
```

The Expo config includes:

```txt
ios.bundleIdentifier: com.hcms.mobile
android.package: com.hcms.mobile
```

### Backend

The backend is a NestJS app with an empty `AppModule`. It listens on `process.env.PORT` when provided, otherwise `3000`.

```txt
apps/backend/src/main.ts
apps/backend/src/app.module.ts
```

<br />

## Run Locally

Prerequisites:

- Node.js and pnpm
- Docker with Docker Compose

Install dependencies:

```bash
pnpm install
```

Create the backend environment file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Start PostgreSQL in Docker:

```bash
pnpm db:up
```

This starts PostgreSQL 18 on `localhost:5432`, creates the `hcms` database, and
stores its data in a named Docker volume. The default credentials match
`apps/backend/.env.example`.

Apply the Prisma migrations:

```bash
pnpm --filter backend prisma:migrate
```

Run all development tasks through Turborepo:

```bash
pnpm dev
```

Run only the mobile app:

```bash
pnpm dev:mobile
```

Run only the backend:

```bash
pnpm dev:backend
```

Stop the database without deleting its data:

```bash
pnpm db:down
```

To delete all local database data and start with a clean database:

```bash
pnpm db:reset
```

<br />

## Useful Commands

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm db:logs
```

Mobile app commands:

```bash
pnpm --filter mobile dev
pnpm --filter mobile ios
pnpm --filter mobile android
pnpm --filter mobile web
pnpm --filter mobile test
```

Backend commands:

```bash
pnpm --filter backend dev
pnpm --filter backend build
pnpm --filter backend typecheck
```

<br />

## Testing

Mobile unit tests are configured with Jest and `jest-expo`:

```bash
pnpm --filter mobile test
```

Web end-to-end tests are configured with Playwright. The Playwright config exports the Expo web app and serves it locally before running tests:

```bash
pnpm e2e:web
```

Mobile end-to-end tests are configured with Maestro:

```bash
pnpm e2e:mobile
```

Maestro requires a simulator or device with the app installed.

<br />

## Production Containers And Cloud Run

The application has two independent production images. Build both images from
the repository root so that pnpm workspace dependencies are available.

Backend image:

```bash
docker build -f apps/backend/Dockerfile -t hcms-backend .
```

Configure `DATABASE_URL` and `CORS_ORIGIN` on the backend Cloud Run service.
`CORS_ORIGIN` accepts a comma-separated list and should include the deployed
mobile web service URL. Cloud Run supplies `PORT` automatically.

Mobile web image:

```bash
docker build \
  -f apps/mobile/Dockerfile \
  --build-arg EXPO_PUBLIC_API_URL=https://YOUR-BACKEND-SERVICE.run.app \
  -t hcms-mobile-web .
```

`EXPO_PUBLIC_API_URL` is embedded in the static JavaScript bundle, so rebuild the
mobile image when the backend's public URL changes. The nginx container reads
Cloud Run's `PORT` environment variable when it starts.

The backend deployment workflows require these GitHub secrets:

- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

Set the required `BACKEND_CORS_ORIGIN` GitHub variable to the deployed mobile
web URL. The workflows also accept `GCP_REGION`, `GCP_CLOUD_SQL_INSTANCE`,
`GCP_DATABASE_URL_SECRET`, `BACKEND_CLOUD_RUN_SERVICE`, and
`BACKEND_MIGRATION_JOB` variables; defaults are provided for the current Google
Cloud resources.

By default, Secret Manager must contain a secret named
`hcms-production-database-url`. Its value must connect through the attached
Cloud SQL Unix socket, for example:

```text
postgresql://USER:PASSWORD@localhost/hcms?host=/cloudsql/PROJECT:REGION:INSTANCE
```

The Cloud Run runtime identity needs Secret Manager Secret Accessor and Cloud
SQL Client access. The CD workflow builds a separate migration image, executes
it as a Cloud Run Job, and deploys the backend only after migrations succeed.

For mobile and web deployment, set the `EXPO_PUBLIC_API_URL` GitHub production
environment variable to the public backend Cloud Run URL. Automatic CD runs
build and deploy the Expo web container through the **Mobile Web CD** workflow.
To create production native builds, manually run the **Mobile Native CD**
workflow and select `all`, `ios`, or `android`.

Native builds also require the `EXPO_TOKEN` GitHub secret and an
`EXPO_PUBLIC_API_URL` variable in the EAS `production` environment for the Expo
project. The production profile is defined in `apps/mobile/eas.json`.

<br />

## Expo Go Compatibility

This project currently uses Expo SDK 56. If Expo Go reports that the project requires a newer version, update Expo Go on the test device and restart the Expo dev server with a cleared cache:

```bash
pnpm --filter mobile dev -- --clear
```

For development that needs native modules or a fixed runtime, use an Expo development build instead of Expo Go.
