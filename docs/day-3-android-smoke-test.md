# Day 3 — Android Customer Smoke Test

## Code-level smoke-flow gate

The customer flow is wired through these stages:

1. OTP login
2. Product browsing
3. Cart
4. Checkout
5. COD payment boundary
6. Order success
7. Inventory sale reservation
8. Local/cloud order persistence
9. My Orders
10. Track Order

The repository includes `scripts/validate-customer-flow.mjs` to verify the route and integration markers remain present.

Run:

~~~bash
npm run test:customer-flow
~~~

## Physical Android test matrix

The following still requires a real Android build/device and configured Firebase project:

- [ ] App launches from release/development build.
- [ ] OTP login succeeds.
- [ ] Session survives app restart.
- [ ] Products page opens.
- [ ] Product enters cart.
- [ ] Cart quantity changes persist.
- [ ] Checkout accepts a valid delivery path.
- [ ] UPI remains unavailable until a real gateway is configured.
- [ ] COD reaches order success.
- [ ] Order appears in My Orders.
- [ ] Track Order opens the saved order.
- [ ] Cloud order is visible for the signed-in customer.
- [ ] A second customer cannot read the first customer's order.
- [ ] Stock decreases exactly once for the completed order.

## Day 3 status

- Customer flow source contract: implemented.
- Automated route/integration check: implemented.
- Real Android runtime smoke test: **pending**.
- Firebase two-account authorization test: **pending**.
- Release build validation: **pending**.

No physical-device pass is claimed until the Android test is actually executed.
