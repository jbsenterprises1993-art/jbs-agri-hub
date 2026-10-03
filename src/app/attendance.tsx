import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import type { AttendanceRecord, AttendanceStatus } from "@/data/attendance-types";
import { attendanceSummary } from "@/services/attendance";
import { getAttendanceRecords, saveAttendanceRecord } from "@/services/attendance-storage";
import { JBS_THEME } from "@/theme/jbs-theme";

const EMPLOYEE_ID = "demo";
const statuses: AttendanceStatus[] = ["present", "absent", "leave", "half_day"];

export default function AttendanceScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => setRecords(await getAttendanceRecords()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const summary = attendanceSummary(records, EMPLOYEE_ID);
  const todayRecord = records.find((record) => record.employeeId === EMPLOYEE_ID && record.date === today);

  const markToday = async (status: AttendanceStatus) => {
    const record: AttendanceRecord = {
      id: `attendance-${EMPLOYEE_ID}-${today}`,
      employeeId: EMPLOYEE_ID,
      date: today,
      status,
      checkIn: status === "present" || status === "half_day" ? new Date().toISOString() : undefined,
    };
    await saveAttendanceRecord(record);
    await load();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button"><Text style={styles.back}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>JBS ATTENDANCE</Text>
        <Text style={styles.title}>Attendance & Salary</Text>
        <Text style={styles.note}>Daily attendance can now be marked and persisted locally. Biometric verification and payroll execution remain integration work.</Text>

        <View style={styles.card}>
          <Text style={styles.section}>Today • {today}</Text>
          <Text style={styles.todayStatus}>{todayRecord ? todayRecord.status.replace("_", " ").toUpperCase() : "NOT MARKED"}</Text>
          <View style={styles.statusGrid}>
            {statuses.map((status) => (
              <Pressable key={status} onPress={() => markToday(status)} style={[styles.statusButton, todayRecord?.status === status && styles.statusActive]} accessibilityRole="button">
                <Text style={todayRecord?.status === status ? styles.statusTextActive : styles.statusText}>{status.replace("_", " ")}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Attendance Summary</Text>
          <Line l="Present" v={summary.present}/><Line l="Absent" v={summary.absent}/><Line l="Leave" v={summary.leave}/><Line l="Half Day" v={summary.halfDay}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Line({l,v}:{l:string;v:number}){return <View style={styles.line}><Text style={styles.label}>{l}</Text><Text style={styles.value}>{v}</Text></View>}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:JBS_THEME.colors.background},container:{padding:JBS_THEME.spacing.lg,paddingBottom:40},
  backButton:{alignSelf:"flex-start",paddingVertical:JBS_THEME.spacing.sm,paddingHorizontal:JBS_THEME.spacing.md,borderRadius:JBS_THEME.radius.md,backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,marginBottom:JBS_THEME.spacing.lg},
  back:{color:JBS_THEME.colors.primarySoft,fontSize:15,fontWeight:"800"},eyebrow:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:JBS_THEME.colors.text,fontSize:28,fontWeight:"900",marginTop:4},
  note:{color:JBS_THEME.colors.textSecondary,fontSize:12,lineHeight:18,marginVertical:JBS_THEME.spacing.lg},card:{backgroundColor:JBS_THEME.colors.surface,borderRadius:JBS_THEME.radius.lg,borderWidth:1,borderColor:JBS_THEME.colors.border,padding:JBS_THEME.spacing.lg,marginBottom:JBS_THEME.spacing.md},
  section:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900",marginBottom:8},todayStatus:{color:JBS_THEME.colors.primary,fontSize:18,fontWeight:"900",marginBottom:12},statusGrid:{flexDirection:"row",flexWrap:"wrap",gap:8},statusButton:{width:"48%",borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,padding:12,alignItems:"center"},statusActive:{backgroundColor:JBS_THEME.colors.surfaceElevated,borderColor:JBS_THEME.colors.primary},statusText:{color:JBS_THEME.colors.textMuted,fontWeight:"800"},statusTextActive:{color:JBS_THEME.colors.primarySoft,fontWeight:"900"},
  line:{flexDirection:"row",justifyContent:"space-between",paddingVertical:JBS_THEME.spacing.md,borderBottomWidth:1,borderBottomColor:JBS_THEME.colors.border},label:{color:JBS_THEME.colors.textSecondary},value:{color:JBS_THEME.colors.text,fontWeight:"900",fontSize:18}
});