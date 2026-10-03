import type { InventoryItem, StockMovement } from "@/data/inventory-types";
import type { Order } from "@/data/order-types";
import {
  commitInventoryAndMovements,
  getInventory,
  getStockMovements,
  saveInventory,
} from "@/services/inventory-storage";

export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    productId: "petrol-power-sprayer",
    productName: "Petrol Power Sprayer",
    sku: "JBS-PS-01",
    quantity: 12,
    lowStockLimit: 5,
    highStockLimit: 30,
    purchaseRate: 9500,
    gstPercent: 18,
    active: true,
  },
  {
    productId: "power-weeder",
    productName: "Power Weeder",
    sku: "JBS-PW-01",
    quantity: 4,
    lowStockLimit: 5,
    highStockLimit: 20,
    purchaseRate: 42000,
    gstPercent: 18,
    active: true,
  },
];

export async function ensureInventorySeeded(): Promise<InventoryItem[]> {
  const inventory = await getInventory();

  if (inventory.length > 0) {
    return inventory;
  }

  await saveInventory(DEFAULT_INVENTORY);
  return DEFAULT_INVENTORY;
}

export function applyStockMovement(
  item: InventoryItem,
  movement: StockMovement,
): InventoryItem {
  const direction =
    movement.type === "purchase" || movement.type === "return" ? 1 : -1;
  const quantity = Math.max(
    0,
    item.quantity + direction * movement.quantity,
  );

  return {
    ...item,
    quantity,
  };
}

export function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.lowStockLimit;
}

export type InventorySaleResult = {
  applied: boolean;
  movements: StockMovement[];
};

// Keep local sale commits serialized. AsyncStorage has no transaction primitive,
// so concurrent order-success screens must not read the same stock snapshot
// and both decrement it.
let inventorySaleQueue: Promise<void> = Promise.resolve();

function enqueueInventorySale<T>(operation: () => Promise<T>): Promise<T> {
  const run = inventorySaleQueue.then(operation, operation);
  inventorySaleQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/**
 * Applies an order as one deterministic stock sale.
 *
 * The orderId/productId pair is used as an idempotency key, so retrying the
 * same order cannot decrement stock twice. All stock levels are validated
 * before the inventory snapshot is committed. Local sale commits are
 * serialized to avoid lost-update races between concurrent order completions.
 */
export function applyOrderSale(
  order: Order,
): Promise<InventorySaleResult> {
  return enqueueInventorySale(async () => {
    const normalizedOrderId = String(order.orderId || "").trim();
    if (!normalizedOrderId) {
      throw new Error("Order ID is required for inventory sale.");
    }

    const inventory = await ensureInventorySeeded();
    const existingMovements = await getStockMovements();

    const sourceItems =
      order.items && order.items.length > 0
        ? order.items
        : [
            {
              id: order.name.toLowerCase().replace(/\s+/g, "-"),
              name: order.name,
              price: order.price,
              quantity: order.quantity,
            },
          ];

    const quantities = new Map<string, number>();

    for (const item of sourceItems) {
      const productId = String(item.id || "").trim();
      const quantity = Math.floor(Number(item.quantity));

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Order contains an invalid inventory item.");
      }

      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }

    const movementKey = (productId: string) =>
      `sale:${normalizedOrderId}:${productId}`;

    const existingKeys = new Set(
      existingMovements
        .filter((movement) => movement.type === "sale" && movement.referenceId)
        .map((movement) => movement.referenceId as string),
    );

    const pending = Array.from(quantities.entries()).filter(
      ([productId]) => !existingKeys.has(movementKey(productId)),
    );

    if (pending.length === 0) {
      return { applied: false, movements: [] };
    }

    const inventoryById = new Map(
      inventory.map((item) => [item.productId, item]),
    );

    for (const [productId, quantity] of pending) {
      const item = inventoryById.get(productId);

      if (!item) {
        throw new Error(`Inventory item not found: ${productId}`);
      }

      if (!Number.isFinite(item.quantity) || item.quantity < quantity) {
        throw new Error(
          `Insufficient stock for ${item.productName}. Available: ${item.quantity}, requested: ${quantity}.`,
        );
      }
    }

    const now = new Date().toISOString();
    const movements: StockMovement[] = pending.map(
      ([productId, quantity]) => {
        const item = inventoryById.get(productId)!;

        return {
          id: `${movementKey(productId)}:${now}`,
          productId,
          type: "sale",
          quantity,
          unitRate: item.purchaseRate,
          referenceId: movementKey(productId),
          createdAt: now,
        };
      },
    );

    const updatedInventory = inventory.map((item) => {
      const quantity = quantities.get(item.productId);

      if (!quantity || existingKeys.has(movementKey(item.productId))) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity - quantity,
      };
    });

    await commitInventoryAndMovements(
      updatedInventory,
      [...movements, ...existingMovements],
    );

    return { applied: true, movements };
  });
}
