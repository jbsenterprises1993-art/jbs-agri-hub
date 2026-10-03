export type AttendanceStatus = "present" | "absent" | "leave" | "half_day";

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
};

export type SalaryRecord = {
  id: string;
  employeeId: string;
  month: string;
  workingDays: number;
  paidDays: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: "draft" | "approved" | "paid";
};