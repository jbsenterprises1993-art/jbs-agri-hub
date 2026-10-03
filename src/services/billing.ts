import type { Invoice, InvoiceItem } from "@/data/billing-types";

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateInvoice(items: InvoiceItem[]): Pick<Invoice, "subtotal" | "gstTotal" | "grandTotal"> {
  const subtotal = roundMoney(items.reduce((sum, item) => {
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    return sum + quantity * unitPrice;
  }, 0));

  const gstTotal = roundMoney(items.reduce((sum, item) => {
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const gstPercent = Math.min(100, Math.max(0, Number(item.gstPercent) || 0));
    return sum + quantity * unitPrice * (gstPercent / 100);
  }, 0));

  return {
    subtotal,
    gstTotal,
    grandTotal: roundMoney(subtotal + gstTotal),
  };
}
