import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Order, OrderStatus } from "@/data/order-types";
import { syncOrderStatusToCloud, syncOrderToCloud } from "@/services/cloud-orders";

export const ORDERS_STORAGE_KEY = "jbs_orders";

export async function getOrders(): Promise<Order[]> {
  try {
    const raw = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is Order => {
      if (!item || typeof item !== "object") return false;
      const value = item as Partial<Order>;
      return (
        typeof value.orderId === "string" &&
        typeof value.name === "string" &&
        typeof value.total === "number"
      );
    });
  } catch (error) {
    console.log("Load orders error:", error);
    return [];
  }
}

export async function getOrderById(
  orderId: string,
): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((order) => order.orderId === orderId) ?? null;
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  const withoutDuplicate = orders.filter(
    (item) => item.orderId !== order.orderId,
  );

  await AsyncStorage.setItem(
    ORDERS_STORAGE_KEY,
    JSON.stringify([order, ...withoutDuplicate]),
  );

  await syncOrderToCloud(order);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order[]> {
  const orders = await getOrders();
  const updated = orders.map((order) =>
    order.orderId === orderId ? { ...order, status } : order,
  );

  await AsyncStorage.setItem(
    ORDERS_STORAGE_KEY,
    JSON.stringify(updated),
  );

  await syncOrderStatusToCloud(orderId, status);

  return updated;
}