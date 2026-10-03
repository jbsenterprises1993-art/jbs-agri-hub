import type { AttendanceRecord, SalaryRecord } from "@/data/attendance-types";

export function attendanceSummary(
  records: AttendanceRecord[],
  employeeId: string,
): { present: number; absent: number; leave: number; halfDay: number } {
  const mine = records.filter((record) => record.employeeId === employeeId);
  return {
    present: mine.filter((record) => record.status === "present").length,
    absent: mine.filter((record) => record.status === "absent").length,
    leave: mine.filter((record) => record.status === "leave").length,
    halfDay: mine.filter((record) => record.status === "half_day").length,
  };
}

export function calculateNetSalary(record: SalaryRecord): number {
  return Math.max(0, record.grossAmount - record.deductions);
}