# Day 8 — Firebase readiness

## Completed

- Audited the authentication and Firestore client boundary.
- Added a readiness diagnostic in `src/services/firebase-readiness.ts`.
- Added explicit cloud-order diagnostics when the native OTP session is not available to the Firestore client.
- Hardened local/cloud order merging so a cloud listener cannot erase locally persisted orders.
- Tightened Firestore order-create validation:
  - signed-in users can only create orders for their own UID;
  - the Firestore document ID must match `orderId`;
  - required order fields have basic type validation;
  - only trusted admin claims can update/delete orders.

## Current production blocker

The app's phone OTP login uses React Native Firebase Auth, while the current Firestore service uses the Firebase Web SDK. Those SDK clients do not automatically share the same native authentication session.

The new readiness diagnostic intentionally reports this mismatch instead of treating cloud sync as healthy.

## Next production bridge

Choose and implement one supported architecture before production Firebase validation:

1. Add `@react-native-firebase/firestore` and migrate native cloud order access to the same native Firebase session; or
2. Introduce a trusted backend/API bridge that accepts Firebase ID tokens and performs server-side Firestore operations.

Do not mark production Firebase validation complete until the selected bridge is built and tested on a real Android build.

## Safety boundary

No admin claim, payment gateway, production deployment, or paid build was changed automatically during Day 8.
