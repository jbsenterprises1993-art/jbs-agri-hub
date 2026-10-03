# JBS Ecosystem Build Registry

Branch: jbs-ecosystem-foundation-2026-10-03

## Safety rule
- Preserve existing source.
- Work from a checkpoint branch before modifications.
- Do not claim an app is complete until source, dependency install, lint/type checks, and Android build/test are verified.
- Keep credentials/secrets out of source control.

## App portfolio
1. JBS Agri Hub — existing Expo/React Native customer app — connected source
2. JBS Owner App — owner control center
3. JBS Billing App — billing/invoice/GST
4. JBS Stock App — inventory/purchase/low-stock
5. JBS Accounts App — cash/bank/profit/salary accounts
6. JBS Attendance App — attendance/salary workflow
7. JBS Marketing App — campaigns/content/social publishing
8. JBS Delivery App — dispatch/transport/tracking
9. JBS Controller App — ecosystem control/maintenance
10. JBS AI App — owner AI assistant
11. JBS Branch App — multi-branch operations
12. JBS Reports App — sales/profit/stock/reporting

## Shared architecture
- Mobile foundation: Expo + React Native + Expo Router.
- Backend direction: Firebase services already used by JBS Agri Hub; shared data contracts should be introduced before duplicating business logic.
- Shared domains: users, products, pricing, GST, stock, orders, payments, customers, branches, staff, attendance, delivery, JBS Coin, notifications, audit logs.
- Role model: customer, staff, branch manager, owner, controller.
- Language: Tamil-first with future multi-language support.
- AI workflow: ChatGPT/Claude/Gemini for coding/review; Perplexity for research; Canva/Leonardo/Ideogram for marketing assets; CapCut/Runway/Pika for video; automation tools only where they provide a concrete integration.

## Current implementation status
- Existing JBS Agri Hub GitHub repository is available and writable.
- Existing main branch is preserved.
- This branch is the safe foundation checkpoint for ecosystem work.
- Existing source should be reused; do not rebuild Agri Hub from scratch.
- Other apps should be created as isolated workstreams and connected through shared contracts rather than copied code.

## Build order
Phase 1: shared contracts + Owner/Controller foundation.
Phase 2: Billing + Stock + Accounts.
Phase 3: Branch + Attendance + Delivery.
Phase 4: Marketing + AI + Reports.
Phase 5: integration testing, Android builds, release preparation.

## Verification gate
Before any release:
1. npm dependency installation succeeds.
2. TypeScript/lint checks pass.
3. Expo Android development build starts.
4. Core navigation and authentication are tested on Android.
5. Firebase configuration is validated without exposing secrets.
6. A release checkpoint is committed before the next feature wave.
