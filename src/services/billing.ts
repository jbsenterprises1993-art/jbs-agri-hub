import type { Invoice, InvoiceItem } from "@/data/billing-types";

export function calculateInvoice(items: InvoiceItem[]): Pick<Invoice, "subtotal" | "gstTotal" | "grandTotal"> {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gstTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (item.gstPercent / 100),
    0,
  );

  return {
    subtotal,
    gstTotal,
    grandTotal: subtotal + gstTotal,
  };
}