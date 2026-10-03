import type { BusinessMetric, ReportPeriod } from "@/data/report-types";
import type { Order } from "@/data/order-types";

function isWithinPeriod(dateValue: string, periodStart: string, periodEnd: string): boolean {
  const time = new Date(dateValue).getTime();
  if (!Number.isFinite(time)) return false;
  const start = new Date(periodStart).getTime();
  const end = new Date(periodEnd + "T23:59:59.999").getTime();
  return time >= start && time <= end;
}

export function buildBusinessMetric(
  orders: Order[],
  period: ReportPeriod,
  periodStart: string,
  periodEnd: string,
): BusinessMetric {
  const periodOrders = orders.filter((order) => isWithinPeriod(order.date, periodStart, periodEnd));
  const sales = periodOrders.reduce((sum, order) => sum + Math.max(0, Number(order.total || 0)), 0);
  const expenses = 0;

  return {
    period,
    periodStart,
    periodEnd,
    sales,
    expenses,
    profit: sales - expenses,
    orderCount: periodOrders.length,
  };
}
