# JBS 2-Day Final Launch Sprint

Reviewed: 2026-10-04

## Day 1 — Runtime + Firebase Final Validation
1. Android real-device smoke test:
   - Launch
   - OTP login/session
   - Products
   - Cart + quantity
   - Checkout
   - COD
   - Order success
   - My Orders
   - Track Order
2. Firebase runtime validation:
   - Customer authentication
   - Customer creates own order
   - Customer reads own order
   - Second customer cannot read first customer's order
   - Admin claim boundary
3. Inventory:
   - Successful COD order decrements stock once
   - Retry does not double-decrement
   - Insufficient stock fails closed
4. Fix only release-blocking issues discovered by runtime testing.
5. Re-run TypeScript + regression CI after fixes.

## Day 2 — Production Build + Release Validation
1. Final regression after Day 1 fixes.
2. EAS production AAB build.
3. Install/test production build on Android.
4. Verify:
   - app launch
   - login
   - product/cart
   - COD order
   - order history/tracking
   - Firebase cloud path
5. Final release configuration and Play Console submission preparation.
6. Record evidence and remaining blockers.

## Must NOT be falsely marked complete
- UPI/payment gateway until a real provider is configured and server verification is tested.
- Social publishing until provider APIs/credentials are configured.
- AI/voice provider integration until configured and runtime-tested.
- Play Store public availability until Google Play review/publishing is actually complete.

## Exit Gate
Launch can proceed only after:
- Android runtime smoke test passes.
- Firebase authorization test passes.
- Production AAB installs and critical customer flow passes.
- No release-blocking regression remains.

A failed runtime gate becomes the next fix; it is not marked as passed.
