export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

export type BusinessMetric = {
  period: ReportPeriod;
  periodStart: string;
  periodEnd: string;
  sales: number;
  expenses: number;
  profit: number;
  orderCount: number;
};