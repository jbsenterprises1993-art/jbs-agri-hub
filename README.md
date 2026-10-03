# JBS Agri Hub

JBS Agri Hub is the JBS Enterprises customer-facing Expo React Native application.

## Stack

- Expo SDK 54
- Expo Router
- React Native 0.81
- TypeScript
- Firebase Authentication
- Firestore REST bridge
- AsyncStorage for local order/inventory/billing persistence
- EAS Build for production Android artifacts

## Development

Install dependencies:

```bash
npm ci
```

Start the project:

```npm
npm start
```

Run the automated release regression:

```bash
npm run test:regression
```

Run the TypeScript check:

```bash
npx tsc --noEmit
```

## Android production configuration

- Android application ID: `com.bala44933team.jbsagrihub`
- Firebase configuration: `google-services.json`
- EAS project is configured in `app.json`
- Production EAS profile uses remote app-versioning with auto-increment

The repository preflight validates these release settings before CI can pass.

## Production build

A production Android App Bundle is intended to be built with the configured EAS production profile:

```bash
npx eas build --platform android --profile production
```

This is a paid/consumptive build action depending on the account's EAS allowance. Do not trigger it automatically from CI.

After a production AAB is available, install the corresponding release build on a real Android device and execute the runtime release matrix in `docs/2-day-final-launch-sprint.md`.

## Release gates

The following must be evidenced before calling the app production-ready:

- TypeScript check passes.
- Automated regression suite passes.
- Real Android customer flow passes.
- Firebase two-account authorization test passes.
- Inventory sale is applied exactly once.
- Production AAB installs and critical flow passes.
- Remaining integrations are either configured and tested or explicitly kept disabled.

### Current intentionally disabled/unverified integrations

- UPI/payment gateway
- Live transport tracking
- Social publishing APIs
- AI model/voice provider integration
- Native PDF runtime generation

These must not be represented as production-enabled features until their provider/runtime validation is complete.

## Project documentation

- `docs/2-day-final-launch-sprint.md` — final launch execution plan
- `docs/day-10-release-readiness.md` — release gates and blockers
- `docs/jbs-ecosystem.json` — ecosystem source of truth
