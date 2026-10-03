import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Invoice } from "@/data/billing-types";

const INVOICE_KEY = "jbs_invoices";

export async function getInvoices(): Promise<Invoice[]> {
  const raw = await AsyncStorage.getItem(INVOICE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  const invoices = await getInvoices();
  const next = [invoice, ...invoices.filter((item) => item.invoiceId !== invoice.invoiceId)];
  await AsyncStorage.setItem(INVOICE_KEY, JSON.stringify(next));
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const invoices = await getInvoices();
  return invoices.find((invoice) => invoice.invoiceId === invoiceId) ?? null;
}
