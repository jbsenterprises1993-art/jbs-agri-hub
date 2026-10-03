import type { AttendanceRecord, SalaryRecord } from "@/data/attendance-types";

export function calculatePaidDays(records: AttendanceRecord[], employeeId: string, month: string): number {
  return records
    .filter((record) => record.employeeId === employeeId && record.date.startsWith(month))
    .reduce((sum, record) => {
      if (record.status === "present") return sum + 1;
      if (record.status === "half_day") return sum + 0.5;
      return sum;
    }, 0);
}

export function calculateSalary(
  records: AttendanceRecord[],
  employeeId: string,
  month: string,
  workingDays: number,
  monthlyGross: number,
  deductions = 0,
): SalaryRecord {
  const safeWorkingDays = Math.max(1, Math.floor(Number(workingDays) || 1));
  const safeGross = Math.max(0, Number(monthlyGross) || 0);
  const paidDays = Math.min(safeWorkingDays, calculatePaidDays(records, employeeId, month));
  const grossAmount = Math.round(((safeGross / safeWorkingDays) * paidDays + Number.EPSILON) * 100) / 100;
  const safeDeductions = Math.min(grossAmount, Math.max(0, Number(deductions) || 0));
  return {
    id: `salary-${employeeId}-${month}`,
    employeeId,
    month,
    workingDays: safeWorkingDays,
    paidDays,
    grossAmount,
    deductions: safeDeductions,
    netAmount: Math.round((grossAmount - safeDeductions + Number.EPSILON) * 100) / 100,
    status: "draft",
  };
}
