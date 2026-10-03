import { jbsCollections, listDocuments, addDocument, updateDocument } from "@/services/jbs-firestore";
import type { JbsProduct, JbsStockMovement } from "@/domain/jbs-types";

export async function listJbsProducts() {
  return listDocuments<JbsProduct>(jbsCollections.products);
}

export async function listStockMovements(productId?: string) {
  const movements = await listDocuments<JbsStockMovement>(jbsCollections.stockMovements);
  return productId ? movements.filter((item) => item.productId === productId) : movements;
}

export async function updateJbsProductStock(productId: string, stock: number) {
  await updateDocument(jbsCollections.products, productId, { stock, updatedAt: new Date().toISOString() });
}

export async function recordStockMovement(
  movement: Omit<JbsStockMovement, "id">,
) {
  return addDocument(jbsCollections.stockMovements, movement);
}

export function getStockState(product: JbsProduct) {
  if (product.stock <= 0) return "out_of_stock" as const;
  if (product.stock <= product.lowStockLimit) return "low_stock" as const;
  if (product.maxStockLimit > 0 && product.stock >= product.maxStockLimit) return "max_stock" as const;
  return "normal" as const;
}
