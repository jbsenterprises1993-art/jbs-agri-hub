import { addDocument, jbsCollections, listDocuments } from "@/services/jbs-firestore";
import type { JbsCoinTransaction } from "@/domain/jbs-types";

export async function listJbsCoinTransactions(customerId?: string) {
  const items = await listDocuments<JbsCoinTransaction>(jbsCollections.coinTransactions);
  return customerId ? items.filter((item) => item.customerId === customerId) : items;
}

export async function recordJbsCoinTransaction(
  transaction: Omit<JbsCoinTransaction, "id">,
) {
  return addDocument(jbsCollections.coinTransactions, transaction);
}

export function calculateJbsCoins(amount: number, coinsPerHundred = 1) {
  if (!Number.isFinite(amount) || amount <= 0 || coinsPerHundred <= 0) return 0;
  return Math.floor(amount / 100) * coinsPerHundred;
}
