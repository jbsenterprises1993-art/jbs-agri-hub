import {
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";\nimport { getFirebaseAuthReadiness } from "@/services/firebase-readiness";
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
  if (!auth.currentUser) {\n    const readiness = getFirebaseAuthReadiness();\n    if (readiness.nativeSignedIn) {\n      console.log("Cloud order sync blocked:", readiness.message);\n    }\n    return false;\n  }

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

export async function getCloudOrderById(
  orderId: string,
): Promise<Order | null> {
  if (!auth.currentUser) {\n    const readiness = getFirebaseAuthReadiness();\n    if (readiness.nativeSignedIn) {\n      console.log("Cloud order read blocked:", readiness.message);\n    }\n    return null;\n  }

  try {
    const snapshot = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return {
      ...(data as Order),
      orderId: snapshot.id,
    };
  } catch (error) {
    console.log("Cloud order read skipped:", error);
    return null;
  }
}

export async function syncOrderStatusToCloud(
  orderId: string,
  status: OrderStatus,
): Promise<boolean> {
  if (!auth.currentUser) return false;

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

export function subscribeToCurrentUserOrders(
  onOrders: (orders: Order[]) => void,
  onError?: (error: Error) => void,
) {
  const userId = auth.currentUser?.uid;
  if (!userId) return () => undefined;

  const userOrdersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(
    userOrdersQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((item) => ({
        ...(item.data() as Order),
        orderId: item.id,
      }));
      onOrders(orders);
    },
    (error) => onError?.(error),
  );
}

export function subscribeToCloudOrders(
  onOrders: (orders: Order[]) => void,
  onError?: (error: Error) => void,
) {
  if (!auth.currentUser) {\n    const readiness = getFirebaseAuthReadiness();\n    if (readiness.nativeSignedIn) {\n      console.log("Cloud order listener blocked:", readiness.message);\n    }\n    return () => undefined;\n  }

  return onSnapshot(
    collection(db, ORDERS_COLLECTION),
    (snapshot) => {
      const orders = snapshot.docs.map((item) => ({
        ...(item.data() as Order),
        orderId: item.id,
      }));
      onOrders(orders);
    },
    (error) => onError?.(error),
  );
}

export function ordersCollectionPath() {
  return collection(db, ORDERS_COLLECTION).path;
}
