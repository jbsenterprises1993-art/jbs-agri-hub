# JBS — 10-Day Production Readiness Target

Target: move the current ecosystem foundation through integration, testing and release-readiness gates without claiming production completion before real validation.

## Day 1 — Firebase bridge
- Resolve the native Firebase Auth ↔ Firestore session architecture.
- Prefer the existing native Firebase stack where practical.
- Add/validate the required Firestore client dependency and shared auth path.
- Keep cloud sync explicitly blocked until verified.

Exit gate: authenticated Firestore access works with the same signed-in user on Android.

## Day 2 — Firebase security
- Validate customer order ownership rules.
- Validate admin custom-claim boundary.
- Test create/read/update behavior.
- Document deployment steps for production rules.

Exit gate: customer cannot read another customer's order; admin access requires trusted claim.

## Day 3 — Android customer smoke test
- OTP login
- Product browsing
- Cart
- Checkout
- COD payment
- Order success
- My Orders
- Track Order
- Restart/session persistence

Exit gate: one complete test order works on a real Android device.

## Day 4 — Inventory + order integration
- Connect order completion to stock movement design.
- Validate sale/return/adjustment behavior.
- Prepare cloud inventory sync boundary.
- Validate low-stock calculations.

Exit gate: stock changes are deterministic and no phantom movements occur.

## Day 5 — Billing production workflow
- Invoice persistence.
- GST/CGST/SGST validation.
- Bill PDF generation.
- Invoice numbering/storage design.
- Link successful COD order data to invoice data.

Exit gate: a test order can produce a complete invoice artifact without corrupt totals.

## Day 6 — Owner + Accounts
- Live owner KPIs.
- Sales/order summary.
- Account ledger integration.
- Profit/salary account workflow.
- Salary automation foundation.

Exit gate: owner dashboard uses validated business data and does not label zero-expense calculations as true profit.

## Day 7 — Payment + Delivery
- Keep COD stable.
- Design/implement payment gateway boundary only with provider credentials/configuration.
- Payment verification must be server-side.
- Connect delivery status workflow to orders.
- Transport tracking foundation.

Exit gate: payment state cannot be marked paid merely by client-side UI.

## Day 8 — Marketing + JBS AI
- Marketing provider integration boundary.
- Scheduled post workflow.
- AI model/provider boundary.
- Explicit permissions for AI actions.
- No unrestricted financial/admin writes.
- Voice control architecture.

Exit gate: AI actions remain permission-controlled and external publishing is not falsely marked successful.

## Day 9 — Full regression
- TypeScript CI.
- Customer flow regression.
- Firebase regression.
- Inventory/billing/accounts regression.
- Owner/admin authorization checks.
- Android physical-device smoke test.
- Fix all discovered blocking errors.

Exit gate: latest CI is green and no known blocking runtime defect remains.

## Day 10 — Release readiness
- Production Android build validation.
- AAB/release configuration review.
- Version/build number verification.
- Firebase production configuration verification.
- Play Store release checklist.
- Final security checklist.
- Final known-blockers report.

Exit gate: release candidate is technically validated. Actual Play Store submission/release remains a deliberate owner action.

## Rules for this target

- Do not claim a feature is production-ready until it passes its exit gate.
- Do not expose or rotate credentials automatically.
- Do not enable payment providers without required provider configuration.
- Do not assign admin privileges automatically.
- Do not merge the foundation PR automatically.
- Keep CI status evidence-based.
