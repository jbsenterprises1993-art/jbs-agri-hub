export type JbsRole = "customer" | "staff" | "branch_manager" | "owner" | "controller";

export interface JbsUser {
  id: string;
  phone?: string;
  name: string;
  role: JbsRole;
  branchId?: string;
  active: boolean;
  createdAt?: string;
}

export interface JbsProduct {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  sku?: string;
  purchaseRate: number;
  sellingRate: number;
  gstPercent: number;
  stock: number;
  lowStockLimit: number;
  maxStockLimit: number;
  active: boolean;
  updatedAt?: string;
}

export interface JbsStockMovement {
  id: string;
  productId: string;
  branchId?: string;
  type: "purchase" | "sale" | "return" | "adjustment" | "transfer";
  quantity: number;
  rate?: number;
  referenceId?: string;
  note?: string;
  createdAt: string;
}

export interface JbsOrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitRate: number;
  gstPercent: number;
  discount: number;
}

export interface JbsOrder {
  id: string;
  customerId: string;
  branchId?: string;
  items: JbsOrderItem[];
  subtotal: number;
  gstAmount: number;
  discountAmount: number;
  total: number;
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "cod";
  createdAt: string;
}

export interface JbsAttendance {
  id: string;
  staffId: string;
  branchId?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "late" | "absent" | "leave";
}

export interface JbsLedgerEntry {
  id: string;
  accountId: string;
  type: "credit" | "debit";
  amount: number;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  createdAt: string;
}

export interface JbsDelivery {
  id: string;
  orderId: string;
  transport: string;
  trackingNumber?: string;
  status: "pending" | "dispatched" | "in_transit" | "delivered" | "failed";
  charge: number;
  updatedAt: string;
}

export interface JbsCoinTransaction {
  id: string;
  customerId: string;
  coins: number;
  type: "earned" | "redeemed" | "adjustment";
  referenceId?: string;
  createdAt: string;
}
