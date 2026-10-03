import { getAuth } from "@react-native-firebase/auth";
import type { Order, OrderStatus } from "@/data/order-types";
import {
  firestoreOrdersPath,
  getFirestoreOrder,
  listFirestoreOrders,
  queryFirestoreOrdersByUser,
  saveFirestoreOrder,
} from "@/services/firestore-rest";

const POLL_INTERVAL_MS = 15000;

function currentUser() {
  return getAuth().currentUser;
}

export async function syncOrderToCloud(order: Order): Promise<boolean> {
  const user = currentUser();
  if (!user) return false;

  try {
    return await saveFirestoreOrder(order.orderId, {
      ...order,
      userId: user.uid,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log("Cloud order sync skipped:", error);
    return false;
  }
}

export async function getCloudOrderById(
  orderId: string,
): Promise<Order | null> {
  if (!currentUser()) return null;

  try {
    const order = await getFirestoreOrder(orderId);
    return order ? ({ ...order, orderId } as Order) : null;
  } catch (error) {
    console.log("Cloud order read skipped:", error);
    return null;
  }
}

export async function syncOrderStatusToCloud(
  orderId: string,
  status: OrderStatus,
): Promise<boolean> {
  const user = currentUser();
  if (!user) return false;

  try {
    return await saveFirestoreOrder(orderId, {
      status,
      updatedAt: new Date().toISOString(),
      userId: user.uid,
    });
  } catch (error) {
    console.log("Cloud order status sync skipped:", error);
    return false;
  }
}

async function loadCurrentUserOrders(onOrders: (orders: Order[]) => void) {
  const user = currentUser();
  if (!user) return;

  try {
    const rows = await queryFirestoreOrdersByUser(user.uid);
    onOrders(
      rows.map((item) => ({
        ...item,
        orderId: String(item.orderId ?? ""),
      })) as Order[],
    );
  } catch (error) {
    console.log("Cloud user-order query skipped:", error);
  }
}

export function subscribeToCurrentUserOrders(
  onOrders: (orders: Order[]) => void,
  _onError?: (error: Error) => void,
) {
  if (!currentUser()) return () => undefined;

  let active = true;
  const poll = async () => {
    if (!active) return;
    await loadCurrentUserOrders(onOrders);
  };

  void poll();
  const timer = setInterval(poll, POLL_INTERVAL_MS);

  return () => {
    active = false;
    clearInterval(timer);
  };
}

async function loadAdminOrders(onOrders: (orders: Order[]) => void) {
  try {
    const rows = await listFirestoreOrders();
    onOrders(
      rows.map((item) => ({
        ...item,
        orderId: String(item.orderId ?? ""),
      })) as Order[],
    );
  } catch (error) {
    console.log("Cloud admin-order query skipped:", error);
  }
}

export function subscribeToCloudOrders(
  onOrders: (orders: Order[]) => void,
  _onError?: (error: Error) => void,
) {
  const user = currentUser();
  if (!user) return () => undefined;

  let active = true;
  const poll = async () => {
    if (!active) return;
    await loadAdminOrders(onOrders);
  };

  void poll();
  const timer = setInterval(poll, POLL_INTERVAL_MS);

  return () => {
    active = false;
    clearInterval(timer);
  };
}

export function ordersCollectionPath() {
  return firestoreOrdersPath();
}
