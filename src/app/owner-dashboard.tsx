import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Order } from "@/data/order-types";
import { getOrders } from "@/services/orders";
import { subscribeToCloudOrders } from "@/services/cloud-orders";
import { buildBusinessMetric } from "@/services/business-reports";
import { isLowStock } from "@/services/inventory";
import { getInventory } from "@/services/inventory-storage";
import { getOwnerControlSummary } from "@/services/owner-controls";
import type { InventoryItem } from "@/data/inventory-types";
import { JBS_THEME } from "@/theme/jbs-theme";

export default function OwnerDashboardScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [nextOrders, nextInventory] = await Promise.all([getOrders(), getInventory()]);
    setOrders(nextOrders);
    setInventory(nextInventory);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let unsubscribe: () => void = () => undefined;

      load().then(() => {
        unsubscribe = subscribeToCloudOrders(
          (cloudOrders) => setOrders(cloudOrders),
          () => undefined,
        );
      });

      return () => unsubscribe();
    }, [load]),
  );

  const confirmed = orders.filter((order) => order.status !== "Delivered").length;
  const delivered = orders.filter((order) => order.status === "Delivered").length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const report = buildBusinessMetric(orders, "daily", new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10));
  const lowStockCount = inventory.filter(isLowStock).length;
  const totalStockUnits = inventory.reduce((sum, item) => sum + Math.max(0, Number(item.quantity || 0)), 0);
  const stockValue = inventory.reduce(
    (sum, item) => sum + Math.max(0, Number(item.quantity || 0)) * Math.max(0, Number(item.purchaseRate || 0)),
    0,
  );
  const controlSummary = getOwnerControlSummary();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>JBS OWNER HUB</Text>
        <Text style={styles.title}>Business Dashboard</Text>
        <Text style={styles.subtitle}>
          Local data + Firestore orders when trusted owner access is configured
        </Text>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#20A653" />
            <Text style={styles.loadingText}>Loading business data...</Text>
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              <Metric label="Orders" value={String(orders.length)} />
              <Metric label="Open" value={String(confirmed)} />
              <Metric label="Delivered" value={String(delivered)} />
              <Metric label="Order Value" value={`₹${revenue.toLocaleString("en-IN")}`} />
              <Metric label="Sales KPI" value={`₹${report.sales.toLocaleString("en-IN")}`} />
              <Metric label="Low Stock" value={String(lowStockCount)} />
              <Metric label="Stock Units" value={String(totalStockUnits)} />
              <Metric label="Stock Value" value={`₹${stockValue.toLocaleString("en-IN")}`} />
              <Metric label="Dev Progress" value={`${controlSummary.progressPercent}%`} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Latest Orders</Text>
              {orders.length === 0 ? (
                <Text style={styles.muted}>No local orders yet.</Text>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <View key={order.orderId} style={styles.orderRow}>
                    <View style={styles.orderMain}>
                      <Text style={styles.orderId}>{order.orderId}</Text>
                      <Text style={styles.orderName}>{order.name}</Text>
                    </View>
                    <View>
                      <Text style={styles.amount}>
                        ₹{Number(order.total || 0).toLocaleString("en-IN")}
                      </Text>
                      <Text style={styles.status}>{order.status}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            <Pressable style={styles.stockCard} onPress={() => router.push("/inventory")}>
              <View style={styles.stockCardHeader}>
                <View style={styles.orderMain}>
                  <Text style={styles.cardTitle}>Stock Alerts</Text>
                  <Text style={styles.stockHint}>Open Inventory →</Text>
                </View>
                <Text style={styles.stockCount}>{lowStockCount} low</Text>
              </View>
              {lowStockCount === 0 ? (
                <Text style={styles.muted}>All tracked items are above the low-stock limit.</Text>
              ) : (
                inventory.filter(isLowStock).map((item) => (
                  <View key={item.productId} style={styles.stockRow}>
                    <View style={styles.orderMain}>
                      <Text style={styles.orderName}>{item.productName}</Text>
                      <Text style={styles.muted}>Limit: {item.lowStockLimit}</Text>
                    </View>
                    <Text style={styles.stockQty}>{Math.max(0, Number(item.quantity || 0))}</Text>
                  </View>
                ))
              )}
            </Pressable>

            <Pressable style={styles.quickButton} onPress={() => router.push("/billing")} accessibilityRole="button">
              <Text style={styles.ordersTitle}>🧾 Billing</Text>
              <Text style={styles.ordersSub}>Create and review GST invoice calculations</Text>
            </Pressable>

            <Pressable style={styles.progressButton} onPress={() => router.push("/live-progress")} accessibilityRole="button">
              <Text style={styles.progressTitle}>📊 Ecosystem Development Progress</Text>
              <Text style={styles.progressSub}>Open the JBS app-by-app progress dashboard</Text>
            </Pressable>

            <Pressable style={styles.modulesButton} onPress={() => router.push("/modules")} accessibilityRole="button">
              <Text style={styles.ordersTitle}>🧩 All JBS Apps</Text>
              <Text style={styles.ordersSub}>Open Billing, Accounts, Attendance, Delivery, Marketing and AI</Text>
            </Pressable>

            <Pressable style={styles.ordersButton} onPress={() => router.push("/admin-orders")} accessibilityRole="button">
              <Text style={styles.ordersTitle}>🛠 Admin Order Management</Text>
              <Text style={styles.ordersSub}>Review orders and update delivery status</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: JBS_THEME.colors.background },
  container: { padding: 18, paddingBottom: 40 },
  back: { color: JBS_THEME.colors.primarySoft, fontSize: 17, fontWeight: "800", marginBottom: 22 },
  eyebrow: { color: JBS_THEME.colors.primarySoft, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: JBS_THEME.colors.text, fontSize: 30, fontWeight: "900", marginTop: 4 },
  subtitle: { color: JBS_THEME.colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 18 },
  loading: { backgroundColor: JBS_THEME.colors.surface, borderRadius: 20, padding: 35, alignItems: "center" },
  loadingText: { color: JBS_THEME.colors.textSecondary, marginTop: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  metric: { width: "48%", backgroundColor: JBS_THEME.colors.surface, borderRadius: 18, padding: 17 },
  metricValue: { color: JBS_THEME.colors.text, fontSize: 24, fontWeight: "900" },
  metricLabel: { color: JBS_THEME.colors.textMuted, fontSize: 11, marginTop: 4, fontWeight: "700" },
  card: { backgroundColor: JBS_THEME.colors.surface, borderRadius: 20, padding: 16 },
  cardTitle: { color: JBS_THEME.colors.text, fontSize: 17, fontWeight: "900", marginBottom: 10 },
  stockCard: { backgroundColor: JBS_THEME.colors.surface, borderRadius: 20, padding: 16, marginBottom: 16 },
  stockCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  stockHint: { color: JBS_THEME.colors.primarySoft, fontSize: 10, fontWeight: "800", marginTop: -6, marginBottom: 8 },
  stockHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stockCount: { color: JBS_THEME.colors.warning, fontSize: 12, fontWeight: "900" },
  stockRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: JBS_THEME.colors.border },
  stockQty: { color: JBS_THEME.colors.warning, fontSize: 22, fontWeight: "900" },
  muted: { color: JBS_THEME.colors.textMuted, fontSize: 13 },
  orderRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderTopWidth: 1, borderTopColor: JBS_THEME.colors.border },
  orderMain: { flex: 1, marginRight: 12 },
  orderId: { color: JBS_THEME.colors.primarySoft, fontSize: 12, fontWeight: "900" },
  orderName: { color: JBS_THEME.colors.textSecondary, fontSize: 12, marginTop: 3 },
  amount: { color: JBS_THEME.colors.text, fontWeight: "900", textAlign: "right" },
  status: { color: JBS_THEME.colors.textMuted, fontSize: 10, marginTop: 3, textAlign: "right" },
  progressButton: { backgroundColor: JBS_THEME.colors.primary, borderRadius: 15, padding: 16, marginTop: 16 },
  progressTitle: { color: JBS_THEME.colors.text, fontWeight: "900", fontSize: 15 },
  progressSub: { color: JBS_THEME.colors.text, fontSize: 11, marginTop: 4 },
  quickButton: { backgroundColor: JBS_THEME.colors.surfaceElevated, borderRadius: 15, padding: 16, marginTop: 10, borderWidth: 1, borderColor: JBS_THEME.colors.border },
  modulesButton: { backgroundColor: JBS_THEME.colors.surfaceElevated, borderRadius: 15, padding: 16, marginTop: 10, borderWidth: 1, borderColor: JBS_THEME.colors.border },
  ordersButton: { backgroundColor: JBS_THEME.colors.surfaceElevated, borderRadius: 15, padding: 16, marginTop: 10, borderWidth: 1, borderColor: JBS_THEME.colors.border },
  ordersTitle: { color: JBS_THEME.colors.text, fontWeight: "900", fontSize: 15 },
  ordersSub: { color: JBS_THEME.colors.textSecondary, fontSize: 11, marginTop: 4 },
});
