# Day 1 — Firebase bridge

## Implemented

- Added a Firestore REST bridge that obtains the Firebase ID token from the same React Native Firebase Auth session used by phone OTP.
- Replaced the order cloud service's Firebase Web SDK auth dependency with the native-auth REST path.
- Customer order reads use a Firestore REST query filtered by the signed-in user's UID.
- Order writes send the native Firebase ID token as a Bearer token.
- Admin-wide order reads remain protected by the Firestore `admin: true` claim.
- Cloud listeners are represented by a conservative polling layer (15 seconds) because the REST bridge does not provide the SDK's realtime listener abstraction.
- Order status updates no longer overwrite the order's `userId`.

## Validation status

Code integration is complete for Day 1, but the bridge is **not yet runtime-validated on a physical Android build**.

Required next checks:

1. Sign in with phone OTP on Android.
2. Obtain a Firebase ID token from the signed-in native user.
3. Create an order through the REST bridge.
4. Read the order through the customer UID query.
5. Verify Firestore rules accept the customer request.
6. Verify another customer cannot read it.
7. Verify admin claim access separately.

Firebase's official REST documentation states that Firebase ID tokens can authenticate Firestore REST requests and that those requests are evaluated by Firestore Security Rules. citeturn5search0

## Architecture decision

The current bridge avoids adding another native Firestore package during the 10-day target and keeps the existing React Native Firebase Auth dependency as the source of truth for identity.
