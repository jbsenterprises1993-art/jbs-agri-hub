import { jbsCollections, getDocument, listDocuments, addDocument, updateDocument } from "@/services/jbs-firestore";
import type { JbsOrder } from "@/domain/jbs-types";

export async function getJbsOrder(orderId: string) {
  return getDocument<JbsOrder>(jbsCollections.orders, orderId);
}

export async function listJbsOrders() {
  return listDocuments<JbsOrder>(jbsCollections.orders);
}

export async function createJbsOrder(order: Omit<JbsOrder, "id">) {
  return addDocument(jbsCollections.orders, order);
}

export async function updateJbsOrderStatus(
  orderId: string,
  status: JbsOrder["status"],
) {
  await updateDocument(jbsCollections.orders, orderId, { status });
}

export async function updateJbsPaymentStatus(
  orderId: string,
  paymentStatus: JbsOrder["paymentStatus"],
) {
  await updateDocument(jbsCollections.orders, orderId, { paymentStatus });
}
