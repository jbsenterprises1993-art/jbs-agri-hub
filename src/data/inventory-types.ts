export type StockMovementType = "purchase" | "sale" | "adjustment" | "return";

export type InventoryItem = {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  lowStockLimit: number;
  highStockLimit?: number;
  purchaseRate: number;
  gstPercent: number;
  active: boolean;
};

export type StockMovement = {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  unitRate: number;
  referenceId?: string;
  createdAt: string;
};