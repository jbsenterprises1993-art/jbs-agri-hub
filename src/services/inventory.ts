import type { InventoryItem, StockMovement } from "@/data/inventory-types";

export function applyStockMovement(
  item: InventoryItem,
  movement: StockMovement,
): InventoryItem {
  const direction = movement.type === "purchase" || movement.type === "return" ? 1 : -1;
  const quantity = Math.max(0, item.quantity + direction * movement.quantity);

  return {
    ...item,
    quantity,
  };
}

export function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.lowStockLimit;
}