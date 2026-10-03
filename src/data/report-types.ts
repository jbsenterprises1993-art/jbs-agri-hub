export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

export type BusinessMetric = {
  period: ReportPeriod;
  periodStart: string;
  periodEnd: string;
  sales: number;
  expenses: number;
  costOfGoods: number;
  grossProfit: number;
  profit: number;
  profitKnown: boolean;
  orderCount: number;
};