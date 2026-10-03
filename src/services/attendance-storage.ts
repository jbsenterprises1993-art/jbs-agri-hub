import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AttendanceRecord } from "@/data/attendance-types";

export const ATTENDANCE_KEY = "jbs_attendance_records";

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(ATTENDANCE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AttendanceRecord[]) : [];
  } catch {
    return [];
  }
}

export async function saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
  const records = await getAttendanceRecords();
  const next = records.filter((item) => item.id !== record.id);
  await AsyncStorage.setItem(ATTENDANCE_KEY, JSON.stringify([record, ...next].slice(0, 1000)));
}
