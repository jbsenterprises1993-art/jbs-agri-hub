import AsyncStorage from "@react-native-async-storage/async-storage";
import type { InventoryItem } from "@/data/inventory-types";

export const INVENTORY_KEY = "jbs_inventory";
export const INVENTORY_MOVEMENTS_KEY = "jbs_inventory_movements";

export async function getInventory(): Promise<InventoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(INVENTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InventoryItem[]) : [];
  } catch {
    return [];
  }
}

export async function saveInventory(items: InventoryItem[]): Promise<void> {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}


export async function getStockMovements(): Promise<import("@/data/inventory-types").StockMovement[]> {
  try {
    const raw = await AsyncStorage.getItem(INVENTORY_MOVEMENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as import("@/data/inventory-types").StockMovement[]) : [];
  } catch {
    return [];
  }
}

export async function recordStockMovement(
  movement: import("@/data/inventory-types").StockMovement,
): Promise<void> {
  const movements = await getStockMovements();
  await AsyncStorage.setItem(
    INVENTORY_MOVEMENTS_KEY,
    JSON.stringify([movement, ...movements].slice(0, 200)),
  );
}
