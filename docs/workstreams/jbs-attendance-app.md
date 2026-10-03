# JBS Attendance App Workstream

Status: Foundation branch created; implementation pending verified build resources.

## Scope
Staff attendance, role, salary inputs, leave, monthly summary and payroll export. Depends on staff/branch.

## Shared requirements
- Tamil / English language selector.
- Mobile-first premium JBS UI.
- Role-aware access.
- Preserve existing JBS Agri Hub source; do not overwrite unrelated features.
- Use shared contracts for auth, customers, products, orders, payments, GST, stock, staff, branches, delivery, JBS Coin, notifications and audit logs.
- Every feature must have loading, empty, error and permission states.
- No secrets or API keys in source.

## Verification gates
1. TypeScript/lint
2. Android/dev build
3. Auth/Firebase verification
4. Navigation smoke test
5. Data-flow test
6. Release checkpoint

## Current stock requirement
Stock must include a clear **View Details** action with current quantity, low/high limit, purchase rate, selling rate, GST, valuation, sold quantity, purchase history, movement history, branch stock and low/out-of-stock state.
