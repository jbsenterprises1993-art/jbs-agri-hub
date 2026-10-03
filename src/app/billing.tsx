import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { calculateInvoice } from "@/services/billing";
import type { InvoiceItem } from "@/data/billing-types";
import { JBS_THEME } from "@/theme/jbs-theme";

export default function BillingScreen() {
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("12500");
  const item: InvoiceItem = {
    id: "demo",
    name: "Petrol Power Sprayer",
    quantity: Math.max(1, Number(qty) || 1),
    unitPrice: Math.max(0, Number(price) || 0),
    gstPercent: 18,
  };
  const totals = useMemo(() => calculateInvoice([item]), [item.quantity, item.unitPrice]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.eyebrow}>JBS BILLING</Text>
        <Text style={styles.title}>Invoice Foundation</Text>
        <Text style={styles.note}>
          GST calculation engine is ready. PDF generation and production invoice storage remain release work.
        </Text>

        <View style={styles.inputCard}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <Text style={styles.label}>Quantity</Text>
          <TextInput value={qty} onChangeText={setQty} keyboardType="numeric" style={styles.input} />
          <Text style={styles.label}>Unit Price</Text>
          <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Invoice Summary</Text>
          <Line label="Subtotal" value={totals.subtotal} />
          <Line label="GST (18%)" value={totals.gstTotal} />
          <Line label="Grand Total" value={totals.grandTotal} strong />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Line({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <View style={styles.line}>
      <Text style={[styles.lineLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.value, strong && styles.strong]}>
        ₹{value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: JBS_THEME.colors.background },
  container: { padding: JBS_THEME.spacing.lg },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: JBS_THEME.spacing.sm,
    paddingHorizontal: JBS_THEME.spacing.md,
    borderRadius: JBS_THEME.radius.md,
    backgroundColor: JBS_THEME.colors.surface,
    borderWidth: 1,
    borderColor: JBS_THEME.colors.border,
    marginBottom: JBS_THEME.spacing.lg,
  },
  back: { color: JBS_THEME.colors.primarySoft, fontSize: 15, fontWeight: "800" },
  eyebrow: { color: JBS_THEME.colors.primarySoft, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: JBS_THEME.colors.text, fontSize: 28, fontWeight: "900", marginTop: 4 },
  note: { color: JBS_THEME.colors.textSecondary, fontSize: 12, lineHeight: 18, marginVertical: JBS_THEME.spacing.lg },
  inputCard: {
    backgroundColor: JBS_THEME.colors.surface,
    borderRadius: JBS_THEME.radius.lg,
    borderWidth: 1,
    borderColor: JBS_THEME.colors.border,
    padding: JBS_THEME.spacing.lg,
  },
  sectionTitle: { color: JBS_THEME.colors.text, fontSize: 16, fontWeight: "900", marginBottom: JBS_THEME.spacing.sm },
  label: { color: JBS_THEME.colors.textSecondary, fontWeight: "800", fontSize: 12, marginTop: JBS_THEME.spacing.sm },
  input: {
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    color: JBS_THEME.colors.text,
    borderRadius: JBS_THEME.radius.md,
    borderWidth: 1,
    borderColor: JBS_THEME.colors.border,
    padding: JBS_THEME.spacing.md,
    marginTop: 6,
  },
  card: {
    backgroundColor: JBS_THEME.colors.surface,
    borderRadius: JBS_THEME.radius.lg,
    borderWidth: 1,
    borderColor: JBS_THEME.colors.border,
    padding: JBS_THEME.spacing.lg,
    marginTop: JBS_THEME.spacing.lg,
  },
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: JBS_THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: JBS_THEME.colors.border,
  },
  lineLabel: { color: JBS_THEME.colors.textSecondary },
  value: { color: JBS_THEME.colors.text, fontWeight: "800" },
  strong: { color: JBS_THEME.colors.primary, fontWeight: "900" },
});
