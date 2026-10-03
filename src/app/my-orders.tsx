import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import type { Order, OrderStatus } from "@/data/order-types";
import { getOrders } from "@/services/orders";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Page open ஆகும் ஒவ்வொரு முறையும்
  // latest orders load ஆகும்
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  // ==========================
  // LOAD ORDERS
  // ==========================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const parsedOrders = await getOrders();
      setOrders(parsedOrders);
    } catch (error) {
      console.log("Load orders error:", error);

      Alert.alert(
        "Error",
        "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // TRACK ORDER
  // ==========================

  const openTracking = (order: Order) => {
    router.push({
      pathname: "/track-order",
      params: {
        orderId: order.orderId,
        status:
          order.status || "Order Confirmed",
      },
    });
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#07883F"
          />

          <Text style={styles.loadingText}>
            Loading orders...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.title}>
          📦 My Orders
        </Text>

        <Text style={styles.subtitle}>
          JBS Agri Hub Orders
        </Text>

        {/* NO ORDERS */}

        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📦
            </Text>

            <Text style={styles.emptyTitle}>
              No Orders Yet
            </Text>

            <Text style={styles.emptyText}>
              Your JBS Agri Hub orders will
              appear here.
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.shopButtonText}>
                🛒 Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order, index) => {
            const currentStatus =
              order.status ||
              "Order Confirmed";

            return (
              <View
                key={`${order.orderId}-${index}`}
                style={styles.orderCard}
              >
                {/* ORDER HEADER */}

                <View style={styles.orderHeader}>
                  <View style={styles.orderIdBox}>
                    <Text style={styles.orderLabel}>
                      Order ID
                    </Text>

                    <Text style={styles.orderId}>
                      {order.orderId}
                    </Text>
                  </View>

                  {/* STATUS */}

                  <View
                    style={[
                      styles.statusBadge,
                      getStatusBadgeStyle(
                        currentStatus
                      ),
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        getStatusTextStyle(
                          currentStatus
                        ),
                      ]}
                    >
                      {currentStatus}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* PRODUCT */}

                <Text style={styles.productName}>
                  {order.name}
                </Text>

                {/* PRICE */}

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Price
                  </Text>

                  <Text style={styles.value}>
                    ₹
                    {Number(
                      order.price || 0
                    ).toLocaleString()}
                  </Text>
                </View>

                {/* QUANTITY */}

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Quantity
                  </Text>

                  <Text style={styles.value}>
                    {order.quantity || 1}
                  </Text>
                </View>

                {/* PAYMENT */}

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Payment
                  </Text>

                  <Text style={styles.value}>
                    {order.paymentMethod || "-"}
                  </Text>
                </View>

                {/* DELIVERY */}

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Delivery
                  </Text>

                  <Text style={styles.value}>
                    {order.deliveryType || "-"}
                  </Text>
                </View>

                {/* DATE */}

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Date
                  </Text>

                  <Text style={styles.value}>
                    {order.date || "-"}
                  </Text>
                </View>

                {/* TOTAL */}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Total
                  </Text>

                  <Text style={styles.totalValue}>
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </Text>
                </View>

                {/* TRACK ORDER */}

                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() =>
                    openTracking(order)
                  }
                >
                  <Text style={styles.trackButtonText}>
                    🚚 Track Order
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================
// STATUS BADGE COLOR
// ==========================

function getStatusBadgeStyle(
  status: OrderStatus
) {
  switch (status) {
    case "Order Processing":
      return {
        backgroundColor: "#FFF4D6",
      };

    case "Shipped":
      return {
        backgroundColor: "#E3F2FD",
      };

    case "Delivered":
      return {
        backgroundColor: "#DDFBE8",
      };

    default:
      return {
        backgroundColor: "#E8F5E9",
      };
  }
}

function getStatusTextStyle(
  status: OrderStatus
) {
  switch (status) {
    case "Order Processing":
      return {
        color: "#B26A00",
      };

    case "Shipped":
      return {
        color: "#1565C0",
      };

    case "Delivered":
      return {
        color: "#07883F",
      };

    default:
      return {
        color: "#07883F",
      };
  }
}

// ==========================
// STYLES
// ==========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FFF6",
  },

  content: {
    padding: 20,
    paddingBottom: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#07883F",
  },

  backButton: {
    marginTop: 5,
    marginBottom: 10,
  },

  backText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#07883F",
  },

  title: {
    textAlign: "center",
    fontSize: 31,
    fontWeight: "900",
    color: "#07883F",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 25,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderIdBox: {
    flex: 1,
    paddingRight: 10,
  },

  orderLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },

  orderId: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },

  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: "48%",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 17,
  },

  productName: {
    fontSize: 19,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  label: {
    fontSize: 15,
    color: "#6B7280",
  },

  value: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "700",
    maxWidth: "58%",
    textAlign: "right",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
    marginTop: 5,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  totalValue: {
    fontSize: 21,
    fontWeight: "900",
    color: "#07883F",
  },

  trackButton: {
    backgroundColor: "#07883F",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },

  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginTop: 15,
  },

  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  shopButton: {
    backgroundColor: "#07883F",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 22,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});