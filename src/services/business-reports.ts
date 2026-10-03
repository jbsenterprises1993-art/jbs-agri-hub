import type { BusinessMetric, ReportPeriod } from "@/data/report-types";
import type { Order } from "@/data/order-types";
import type { InventoryItem } from "@/data/inventory-types";

function isWithinPeriod(dateValue: string, periodStart: string, periodEnd: string): boolean {
  const time = new Date(dateValue).getTime();
  if (!Number.isFinite(time)) return false;
  const start = new Date(periodStart).getTime();
  const end = new Date(periodEnd + "T23:59:59.999").getTime();
  return time >= start && time <= end;
}

function estimateOrderCost(order: Order, inventory: InventoryItem[]): number {
  const items = order.items?.length
    ? order.items
    : [{ id: order.name.toLowerCase().replace(/\s+/g, "-"), name: order.name, quantity: order.quantity, price: order.price }];

  return items.reduce((sum, item) => {
    const inventoryItem = inventory.find(
      (candidate) => candidate.productId === item.id || candidate.productName.trim().toLowerCase() === item.name.trim().toLowerCase(),
    );
    const unitCost = Math.max(0, Number(inventoryItem?.purchaseRate ?? 0));
    return sum + unitCost * Math.max(0, Number(item.quantity) || 0);
  }, 0);
}

export function buildBusinessMetric(
  orders: Order[],
  period: ReportPeriod,
  periodStart: string,
  periodEnd: string,
  inventory: InventoryItem[] = [],
): BusinessMetric {
  const periodOrders = orders.filter((order) => isWithinPeriod(order.date, periodStart, periodEnd));
  const sales = periodOrders.reduce((sum, order) => sum + Math.max(0, Number(order.total || 0)), 0);
  const costOfGoods = periodOrders.reduce((sum, order) => sum + estimateOrderCost(order, inventory), 0);
  const expenses = 0;
  const grossProfit = Math.max(0, sales - costOfGoods);

  return {
    period,
    periodStart,
    periodEnd,
    sales,
    expenses,
    costOfGoods,
    grossProfit,
    profit: grossProfit - expenses,
    profitKnown: false,
    orderCount: periodOrders.length,
  };
}
