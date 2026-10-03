# JBS Firebase Production Checklist

## Completed in source
- Firebase Auth and Firestore are configured in the app.
- Orders can sync to Firestore after authentication.
- Tracking can fall back to a cloud order lookup.
- Owner Dashboard can subscribe to real-time Firestore orders.
- Firestore rules require authentication for customer orders.
- Firestore admin-wide access requires the custom admin auth claim.

## Required before production release
1. Deploy firestore.rules to the JBS Firebase project.
2. Create the intended owner/admin account and set its Firebase custom claim to admin: true using a trusted server/Admin SDK process.
3. Test customer isolation: one customer must not read another customer's order.
4. Test owner/admin access to the complete order list.
5. Test order creation, status changes and tracking on two devices.
6. Confirm Firebase Phone Authentication and OTP behavior in the release build.
7. Confirm Firebase indexes/rules in the Firebase console if additional query patterns are introduced.
8. Only after payment-provider integration is implemented and server-side verified should UPI be enabled.

The app must not treat a failed cloud sync as proof that an order was cloud-persisted.
