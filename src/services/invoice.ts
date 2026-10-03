import type { Invoice, InvoiceItem } from "@/data/billing-types";
import type { Order } from "@/data/order-types";
import { calculateInvoice } from "@/services/billing";
import { getInvoices, saveInvoice } from "@/services/billing-storage";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export async function nextInvoiceNumber(date = new Date()): Promise<string> {
  const prefix = `JBS-${date.getFullYear()}${pad(date.getMonth() + 1)}`;
  const invoices = await getInvoices();
  const used = invoices
    .filter((invoice) => invoice.invoiceId.startsWith(`${prefix}-`))
    .map((invoice) => Number(invoice.invoiceId.slice(prefix.length + 1)))
    .filter(Number.isFinite);
  const next = used.length ? Math.max(...used) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

export function buildInvoiceItemsFromOrder(order: Order, gstPercent: number): InvoiceItem[] {
  const source = order.items?.length
    ? order.items
    : [{ id: order.name.toLowerCase().replace(/\\s+/g, "-"), name: order.name, price: order.price, quantity: order.quantity }];

  return source.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    unitPrice: Math.max(0, Number(item.price) || 0),
    gstPercent: Math.min(100, Math.max(0, Number(gstPercent) || 0)),
  }));
}

export async function createInvoiceForOrder(
  order: Order,
  gstPercent: number,
  customerName = order.customerName ?? "Walk-in Customer",
): Promise<Invoice> {
  const items = buildInvoiceItemsFromOrder(order, gstPercent);
  const totals = calculateInvoice(items);
  const invoice: Invoice = {
    invoiceId: await nextInvoiceNumber(),
    orderId: order.orderId,
    customerName: customerName.trim() || "Walk-in Customer",
    customerMobile: order.mobile,
    items,
    ...totals,
    status: "issued",
    issuedAt: new Date().toISOString(),
  };
  await saveInvoice(invoice);
  return invoice;
}

export function buildInvoiceHtml(invoice: Invoice): string {
  const rows = invoice.items.map((item) =>
    `<tr><td>${escapeHtml(item.name)}</td><td>${item.quantity}</td><td>₹${item.unitPrice.toFixed(2)}</td><td>${item.gstPercent}%</td></tr>`,
  ).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(invoice.invoiceId)}</title>
  <style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{margin:0 0 8px}.meta{color:#555;margin-bottom:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}.totals{margin-top:20px;margin-left:auto;width:280px}.row{display:flex;justify-content:space-between;padding:6px 0}.grand{font-weight:700;border-top:2px solid #111;padding-top:10px}</style>
  </head><body><h1>JBS Enterprises</h1><div class="meta">Invoice ${escapeHtml(invoice.invoiceId)} • ${escapeHtml(invoice.customerName)}</div>
  <table><thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>GST</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="totals"><div class="row"><span>Subtotal</span><span>₹${invoice.subtotal.toFixed(2)}</span></div><div class="row"><span>GST</span><span>₹${invoice.gstTotal.toFixed(2)}</span></div><div class="row grand"><span>Total</span><span>₹${invoice.grandTotal.toFixed(2)}</span></div></div></body></html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char] ?? char));
}
