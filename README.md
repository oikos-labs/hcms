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

Install dependencies:

```bash
pnpm install
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

<br />

## Useful Commands

```bash
pnpm build
pnpm lint
pnpm typecheck
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

## Expo Go Compatibility

This project currently uses Expo SDK 56. If Expo Go reports that the project requires a newer version, update Expo Go on the test device and restart the Expo dev server with a cleared cache:

```bash
pnpm --filter mobile dev -- --clear
```

For development that needs native modules or a fixed runtime, use an Expo development build instead of Expo Go.
