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
  const controlSummary = getOwnerControlSummary();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>JBS OWNER HUB</Text>
        <Text style={styles.title}>Business Dashboard</Text>
        <Text style={styles.subtitle}>
          Local data + real-time Firestore when admin access is configured
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

            <Pressable style={styles.progressButton} onPress={() => router.push("/live-progress")}>
              <Text style={styles.progressTitle}>📊 Ecosystem Development Progress</Text>
              <Text style={styles.progressSub}>Open the JBS app-by-app progress dashboard</Text>
            </Pressable>

            <Pressable style={styles.modulesButton} onPress={() => router.push("/modules")}>
              <Text style={styles.ordersTitle}>🧩 All JBS Apps</Text>
              <Text style={styles.ordersSub}>Open Billing, Accounts, Attendance, Delivery, Marketing and AI</Text>
            </Pressable>

            <Pressable style={styles.ordersButton} onPress={() => router.push("/admin-orders")}>
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
  safe: { flex: 1, backgroundColor: "#071A12" },
  container: { padding: 18, paddingBottom: 40 },
  back: { color: "#6ED99A", fontSize: 17, fontWeight: "800", marginBottom: 22 },
  eyebrow: { color: "#6ED99A", fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginTop: 4 },
  subtitle: { color: "#9BC7A9", fontSize: 12, lineHeight: 18, marginTop: 6, marginBottom: 18 },
  loading: { backgroundColor: "#102A1D", borderRadius: 20, padding: 35, alignItems: "center" },
  loadingText: { color: "#C9D8CE", marginTop: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  metric: { width: "48%", backgroundColor: "#102A1D", borderRadius: 18, padding: 17 },
  metricValue: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  metricLabel: { color: "#8EAE99", fontSize: 11, marginTop: 4, fontWeight: "700" },
  card: { backgroundColor: "#102A1D", borderRadius: 20, padding: 16 },
  cardTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", marginBottom: 10 },
  muted: { color: "#8EAE99", fontSize: 13 },
  orderRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#1D4030" },
  orderMain: { flex: 1, marginRight: 12 },
  orderId: { color: "#6ED99A", fontSize: 12, fontWeight: "900" },
  orderName: { color: "#C9D8CE", fontSize: 12, marginTop: 3 },
  amount: { color: "#FFFFFF", fontWeight: "900", textAlign: "right" },
  status: { color: "#8EAE99", fontSize: 10, marginTop: 3, textAlign: "right" },
  progressButton: { backgroundColor: "#20A653", borderRadius: 15, padding: 16, marginTop: 16 },
  progressTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  progressSub: { color: "#DDFBE8", fontSize: 11, marginTop: 4 },
  modulesButton: { backgroundColor: "#18352A", borderRadius: 15, padding: 16, marginTop: 10, borderWidth: 1, borderColor: "#2B7650" },
  ordersButton: { backgroundColor: "#163B28", borderRadius: 15, padding: 16, marginTop: 10, borderWidth: 1, borderColor: "#28633F" },
  ordersTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  ordersSub: { color: "#9BC7A9", fontSize: 11, marginTop: 4 },
});
