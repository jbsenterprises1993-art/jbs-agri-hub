import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
}

export async function setDocument<T extends object>(collectionName: string, id: string, data: T) {
  await setDoc(doc(db, collectionName, id), data, { merge: true });
}

export async function updateDocument(collectionName: string, id: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function deleteDocument(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function addDocument<T extends object>(collectionName: string, data: T) {
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
}

export async function listDocuments<T>(
  collectionName: string,
  constraints: Array<ReturnType<typeof where> | ReturnType<typeof orderBy> | ReturnType<typeof limit>> = [],
): Promise<T[]> {
  const snapshot = await getDocs(query(collection(db, collectionName), ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

export const jbsCollections = {
  users: "jbs_users",
  products: "jbs_products",
  stockMovements: "jbs_stock_movements",
  orders: "jbs_orders",
  attendance: "jbs_attendance",
  ledger: "jbs_ledger",
  deliveries: "jbs_deliveries",
  coinTransactions: "jbs_coin_transactions",
  branches: "jbs_branches",
  notifications: "jbs_notifications",
  auditLogs: "jbs_audit_logs",
} as const;
