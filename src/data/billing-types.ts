export type InvoiceStatus = "draft" | "issued" | "cancelled";

export type InvoiceItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  gstPercent: number;
};

export type Invoice = {
  invoiceId: string;
  customerName: string;
  customerMobile?: string;
  items: InvoiceItem[];
  subtotal: number;
  gstTotal: number;
  grandTotal: number;
  status: InvoiceStatus;
  issuedAt?: string;
};