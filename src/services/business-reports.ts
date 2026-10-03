import type { BusinessMetric, ReportPeriod } from "@/data/report-types";
import type { Order } from "@/data/order-types";

export function buildBusinessMetric(
  orders: Order[],
  period: ReportPeriod,
  periodStart: string,
  periodEnd: string,
): BusinessMetric {
  const sales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const expenses = 0;

  return {
    period,
    periodStart,
    periodEnd,
    sales,
    expenses,
    profit: sales - expenses,
    orderCount: orders.length,
  };
}
