# Day 2 — Firebase Security Boundary

## Scope

This checkpoint hardens the Firestore order authorization boundary and records what is verified in source versus what still requires a Firebase/Android runtime test.

## Rule contract

### Customer create

A signed-in customer may create an order only when:

- orderId matches the document path.
- userId matches the current Firebase Auth UID.
- name is a non-empty string.
- total is a number greater than or equal to zero.
- date is a non-empty string.
- status is one of pending, processing, shipped, delivered, or cancelled.

### Customer read

A signed-in customer may read only a document whose stored userId equals the current Auth UID.

### Admin read/update/delete

Admin-wide access requires the trusted Firebase Auth custom claim: admin == true.

Normal signed-in users do not receive admin-wide access from their UID alone.

### Customer update/delete

Customer-side update and delete are intentionally blocked. Only the trusted admin claim can perform those operations.

## Automated source-level check

Run:

~~~bash
npm run test:firestore-rules
~~~

The check verifies the critical security fragments are still present in firestore.rules. It is a contract check, not a replacement for the Firebase Emulator Suite or deployed-project test.

## Production deployment procedure

1. Review firestore.rules in the release branch.
2. Authenticate with the Firebase project owner/deployment account.
3. Deploy the rules using the project's approved Firebase CLI workflow.
4. Verify the deployed rules version in Firebase Console.
5. Run authenticated customer tests with two separate test accounts:
   - Account A can create/read Account A orders.
   - Account A cannot read Account B orders.
   - Account A cannot update/delete orders.
6. Verify an account without the admin custom claim cannot perform admin reads.
7. Verify a controlled test account with the trusted admin claim can perform the intended admin operations.
8. Record the test date, project/environment, and result before calling the security exit gate complete.

## Important payment boundary

Firestore rules validate the client-provided order shape, but they do not make a client-provided price trustworthy. Production billing/payment must calculate authoritative prices on a trusted backend and verify payment server-side before treating an order as paid.

## Day 2 status

- Rule-level ownership boundary: implemented.
- Admin custom-claim boundary: implemented.
- Invalid/negative client order totals: rejected by rules.
- Automated rule-contract check: implemented.
- Firebase deployment: **not performed automatically**.
- Two-account runtime authorization test: **pending**.
- Day 2 exit gate: **pending runtime validation**.
