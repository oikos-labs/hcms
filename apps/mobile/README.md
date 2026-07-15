# Mobile development

## Daily development

Install a development build on each test device or simulator, then start Metro:

```sh
pnpm --filter mobile dev
```

JavaScript, TypeScript, styling, and runtime-loaded asset changes use Fast Refresh and do not require a new native build. Native assets such as the app icon and splash screen do require one.

Open an already-installed development build directly:

```sh
pnpm --filter mobile dev:android
pnpm --filter mobile dev:ios
```

## Local native builds

Compile and install a development build using the local Android or iOS toolchain:

```sh
pnpm --filter mobile android
pnpm --filter mobile ios
```

These commands generate the native project when needed, compile it, install it on the selected emulator or simulator, and start Metro. Use them for the initial installation and after native dependencies or native app configuration change. Use `dev`, `dev:android`, or `dev:ios` for routine JavaScript and TypeScript development.

## EAS build profiles

Run EAS commands from `apps/mobile`.

Create a development build when setting up a device, upgrading Expo, changing native app configuration, or adding/updating a dependency with native code:

```sh
eas build --profile development --platform android
eas build --profile development --platform ios
```

Create store binaries only for a release candidate or store submission:

```sh
eas build --profile production --platform all
```

Smoke-test the final production build through TestFlight and the Google Play testing track before submitting it for public release. Development and production builds are separate artifacts; routine code changes do not require rebuilding both.
