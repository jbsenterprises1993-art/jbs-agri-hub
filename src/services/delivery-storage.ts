import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Delivery } from "@/data/delivery-types";

export const DELIVERY_KEY = "jbs_delivery_records";

export async function getDeliveries(): Promise<Delivery[]> {
  try {
    const raw = await AsyncStorage.getItem(DELIVERY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Delivery[]) : [];
  } catch {
    return [];
  }
}

export async function saveDelivery(delivery: Delivery): Promise<void> {
  const deliveries = await getDeliveries();
  const next = deliveries.filter((item) => item.id !== delivery.id);
  await AsyncStorage.setItem(DELIVERY_KEY, JSON.stringify([delivery, ...next].slice(0, 200)));
}
