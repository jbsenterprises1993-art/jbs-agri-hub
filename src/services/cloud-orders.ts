import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import type { Order, OrderStatus } from "@/data/order-types";

const ORDERS_COLLECTION = "orders";

function toFirestoreOrder(order: Order) {
  return {
    ...order,
    userId: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  };
}

export async function syncOrderToCloud(order: Order): Promise<boolean> {
  if (!auth.currentUser) return false;

  try {
    await setDoc(
      doc(db, ORDERS_COLLECTION, order.orderId),
      toFirestoreOrder(order),
      { merge: true },
    );
    return true;
  } catch (error) {
    console.log("Cloud order sync skipped:", error);
    return false;
  }
}

export async function syncOrderStatusToCloud(
  orderId: string,
  status: OrderStatus,
): Promise<boolean> {
  try {
    await setDoc(
      doc(db, ORDERS_COLLECTION, orderId),
      {
        status,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.log("Cloud order status sync skipped:", error);
    return false;
  }
}

export function ordersCollectionPath() {
  return collection(db, ORDERS_COLLECTION).path;
}
