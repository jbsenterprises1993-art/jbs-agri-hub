import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
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

type OrderStatus =
  | "Order Confirmed"
  | "Order Processing"
  | "Shipped"
  | "Delivered";

type Order = {
  orderId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  paymentMethod: string;
  deliveryType: string;
  date: string;
  status?: OrderStatus;
};

const STATUS_OPTIONS: OrderStatus[] = [
  "Order Confirmed",
  "Order Processing",
  "Shipped",
  "Delivered",
];

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  // Page open ஆகும்போது latest orders load
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

      const savedOrders =
        await AsyncStorage.getItem("jbs_orders");

      if (!savedOrders) {
        setOrders([]);
        return;
      }

      const parsedOrders: Order[] =
        JSON.parse(savedOrders);

      setOrders(parsedOrders);
    } catch (error) {
      console.log("Admin load error:", error);

      Alert.alert(
        "Error",
        "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const updatedOrders = orders.map(
        (order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status: newStatus,
            };
          }

          return order;
        }
      );

      // Screen update
      setOrders(updatedOrders);

      // Save
      await AsyncStorage.setItem(
        "jbs_orders",
        JSON.stringify(updatedOrders)
      );

      Alert.alert(
        "Status Updated",
        `${orderId}\n${newStatus}`
      );
    } catch (error) {
      console.log(
        "Admin status update error:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================
  // STATUS CONFIRMATION
  // ==========================

  const confirmStatusChange = (
    order: Order,
    status: OrderStatus
  ) => {
    const currentStatus =
      order.status || "Order Confirmed";

    if (currentStatus === status) {
      return;
    }

    Alert.alert(
      "Change Order Status",
      `${order.orderId}\n\n${currentStatus}\n↓\n${status}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () =>
            updateOrderStatus(
              order.orderId,
              status
            ),
        },
      ]
    );
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
            Loading Admin Orders...
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

        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            🛠 Admin Orders
          </Text>

          <Text style={styles.subtitle}>
            JBS Agri Hub Order Management
          </Text>
        </View>

        {/* TOTAL ORDERS */}

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>
              Total Orders
            </Text>

            <Text style={styles.summaryNumber}>
              {orders.length}
            </Text>
          </View>

          <Text style={styles.summaryIcon}>
            📦
          </Text>
        </View>

        {/* NO ORDERS */}

        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📦
            </Text>

            <Text style={styles.emptyTitle}>
              No Orders
            </Text>

            <Text style={styles.emptyText}>
              Customer orders will appear
              here.
            </Text>
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
                    <Text style={styles.smallLabel}>
                      ORDER ID
                    </Text>

                    <Text style={styles.orderId}>
                      {order.orderId}
                    </Text>
                  </View>

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
                        styles.statusBadgeText,
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
                  {order.name || "JBS Product"}
                </Text>

                {/* DETAILS */}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Price
                  </Text>

                  <Text style={styles.detailValue}>
                    ₹
                    {Number(
                      order.price || 0
                    ).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Quantity
                  </Text>

                  <Text style={styles.detailValue}>
                    {order.quantity || 1}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Payment
                  </Text>

                  <Text style={styles.detailValue}>
                    {order.paymentMethod || "-"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Delivery
                  </Text>

                  <Text style={styles.detailValue}>
                    {order.deliveryType || "-"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    Date
                  </Text>

                  <Text style={styles.detailValue}>
                    {order.date || "-"}
                  </Text>
                </View>

                {/* TOTAL */}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Order Total
                  </Text>

                  <Text style={styles.totalValue}>
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </Text>
                </View>

                {/* STATUS CONTROL */}

                <View style={styles.statusControl}>
                  <Text
                    style={styles.statusControlTitle}
                  >
                    🚚 Update Order Status
                  </Text>

                  <Text style={styles.currentText}>
                    Current: {currentStatus}
                  </Text>

                  <View style={styles.buttonContainer}>
                    {STATUS_OPTIONS.map(
                      (statusOption) => {
                        const selected =
                          currentStatus ===
                          statusOption;

                        return (
                          <TouchableOpacity
                            key={statusOption}
                            disabled={
                              updatingId ===
                              order.orderId
                            }
                            style={[
                              styles.statusButton,
                              selected &&
                                styles.activeStatusButton,
                            ]}
                            onPress={() =>
                              confirmStatusChange(
                                order,
                                statusOption
                              )
                            }
                          >
                            <Text
                              style={[
                                styles.statusButtonText,
                                selected &&
                                  styles.activeStatusButtonText,
                              ]}
                            >
                              {getShortStatus(
                                statusOption
                              )}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  {updatingId === order.orderId && (
                    <View
                      style={styles.updatingContainer}
                    >
                      <ActivityIndicator
                        size="small"
                        color="#07883F"
                      />

                      <Text style={styles.updatingText}>
                        Updating...
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================
// SHORT STATUS
// ==========================

function getShortStatus(
  status: OrderStatus
) {
  switch (status) {
    case "Order Confirmed":
      return "Confirmed";

    case "Order Processing":
      return "Processing";

    case "Shipped":
      return "Shipped";

    case "Delivered":
      return "Delivered";
  }
}

// ==========================
// STATUS COLORS
// ==========================

function getStatusBadgeStyle(
  status: OrderStatus
) {
  switch (status) {
    case "Order Processing":
      return {
        backgroundColor: "#FFF3CD",
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
        color: "#A66300",
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
    paddingBottom: 70,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#07883F",
    fontWeight: "700",
    fontSize: 16,
  },

  backButton: {
    marginTop: 5,
    marginBottom: 12,
  },

  backText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#07883F",
  },

  header: {
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#07883F",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },

  summaryCard: {
    backgroundColor: "#07883F",
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 5,
  },

  summaryLabel: {
    color: "#DDFBE8",
    fontSize: 14,
    fontWeight: "700",
  },

  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 3,
  },

  summaryIcon: {
    fontSize: 45,
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

  smallLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "800",
    marginBottom: 5,
  },

  orderId: {
    fontSize: 20,
    color: "#111827",
    fontWeight: "900",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    maxWidth: "48%",
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  productName: {
    fontSize: 19,
    color: "#111827",
    fontWeight: "900",
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  detailLabel: {
    color: "#6B7280",
    fontSize: 15,
  },

  detailValue: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    maxWidth: "58%",
    textAlign: "right",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",

    marginTop: 5,
    paddingTop: 15,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
  },

  totalValue: {
    fontSize: 21,
    fontWeight: "900",
    color: "#07883F",
  },

  statusControl: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 15,
    marginTop: 20,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statusControlTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },

  currentText: {
    fontSize: 13,
    color: "#07883F",
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 13,
  },

  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  statusButton: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1.5,
    borderColor: "#D1D5DB",

    borderRadius: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  activeStatusButton: {
    backgroundColor: "#07883F",
    borderColor: "#07883F",
  },

  statusButtonText: {
    color: "#4B5563",
    fontWeight: "800",
    fontSize: 12,
  },

  activeStatusButtonText: {
    color: "#FFFFFF",
  },

  updatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  updatingText: {
    marginLeft: 8,
    color: "#07883F",
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 35,
    alignItems: "center",
    elevation: 4,
  },

  emptyIcon: {
    fontSize: 55,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
});