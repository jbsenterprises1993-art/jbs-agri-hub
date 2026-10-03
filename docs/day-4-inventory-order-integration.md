# Day 4 — Inventory + Order Integration

## Implemented

- Shared default inventory seed now uses the same product IDs as customer cart/order items.
- Successful order flow calls `applyOrderSale` before final order persistence.
- Stock sale quantities are aggregated per product.
- All requested quantities are validated before the stock snapshot is committed.
- Missing inventory items and insufficient stock fail closed instead of silently allowing an oversell.
- Sale movements use an `orderId + productId` reference key.
- Retrying the same order does not decrement stock twice.
- Inventory and movement journal are committed together with one AsyncStorage `multiSet` boundary.
- Low-stock calculation continues to use the persisted inventory quantity.
- Existing manual purchase/sale/adjustment/return movement support remains available.

## Deterministic behavior

Example:

- Starting stock: 12 Petrol Power Sprayers.
- Order quantity: 2.
- First successful order application: stock becomes 10 and one sale movement is recorded.
- Same order retried: stock stays 10 and no duplicate sale movement is created.

## Remaining production boundary

The current inventory implementation is a local foundation. It is not yet a multi-device transactional inventory service. Production cloud inventory sync and server-authoritative stock reservation remain release work.

## Day 4 status

- Order → inventory sale integration: implemented.
- Duplicate-sale protection: implemented.
- Insufficient-stock guard: implemented.
- Low-stock calculations: implemented.
- Cloud inventory synchronization: **pending**.
- Multi-device transactional reservation: **pending**.
- Real Android end-to-end stock test: **pending**.
