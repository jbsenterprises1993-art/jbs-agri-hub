# JBS Android Release Runbook

## Purpose

Use this runbook for the final Android release sequence. It keeps paid/irreversible release actions separate from source validation.

## Gate 1 — Source checks

Run:

```bash
npm ci
npx tsc --noEmit
npm run test:regression
```

All commands must exit successfully.

## Gate 2 — Android runtime

On a real Android device, verify:

1. App launches without a crash.
2. Customer authentication/OTP completes.
3. Products load.
4. Product → cart → checkout works.
5. UPI remains clearly unavailable until a gateway is configured.
6. COD checkout creates exactly one order.
7. Order appears in My Orders.
8. Track Order opens the same order.
9. Re-entering/retrying order completion does not reduce inventory twice.
10. A second customer cannot read the first customer's order.

Record the device result before treating this gate as passed.

## Gate 3 — Firebase authorization

Verify with two separate authenticated accounts:

- Customer A can create/read only Customer A orders.
- Customer B cannot read Customer A orders.
- Admin access is available only through the trusted admin claim.
- Customer accounts cannot update/delete orders directly.

Rules source checks alone are not runtime evidence.

## Gate 4 — Production AAB

Only after Gates 1–3 are green:

```bash
npx eas build --platform android --profile production
```

Confirm the resulting AAB is the intended Android package:

`com.bala44933team.jbsagrihub`

Install the resulting release build on a real Android device and repeat the critical customer flow.

## Gate 5 — Play Console

Play Store submission remains an owner-controlled release action. Do not submit while any release gate above is unverified.

## Intentionally disabled

Until separately configured and tested:

- UPI/payment gateway
- Live transport tracking
- Social publishing APIs
- AI provider/voice runtime
- Native PDF runtime

These features must not be represented as active production integrations merely because their UI or source boundary exists.
