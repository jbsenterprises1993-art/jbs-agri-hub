import AsyncStorage from "@react-native-async-storage/async-storage";
import type { InventoryItem } from "@/data/inventory-types";

export const INVENTORY_KEY = "jbs_inventory";

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
