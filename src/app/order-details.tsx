import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import type { Order } from "@/data/order-types";
import { getOrderById } from "@/services/orders";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams();
  const [cloudOrder, setCloudOrder] = useState<Order | null>(null);

  const paramOrderId = typeof params.orderId === "string" ? params.orderId : "";

  useEffect(() => {
    let active = true;
    if (!paramOrderId) return;
    getOrderById(paramOrderId).then((order) => {
      if (active && order) setCloudOrder(order);
    });
    return () => {
      active = false;
    };
  }, [paramOrderId]);

  const orderId = cloudOrder?.orderId ?? paramOrderId || "JBS Order";

  const name = cloudOrder?.name ?? (typeof params.name === "string" ? params.name : "Product");

  const price = cloudOrder?.price ?? (typeof params.price === "string" ? Number(params.price) : 0);

  const quantity = cloudOrder?.quantity ?? (typeof params.quantity === "string" ? Number(params.quantity) : 1);

  const total = cloudOrder?.total ?? (typeof params.total === "string" ? Number(params.total) : price * quantity);

  const paymentMethod = cloudOrder?.paymentMethod ?? (typeof params.paymentMethod === "string" ? params.paymentMethod : "Payment");

  const deliveryType = cloudOrder?.deliveryType ?? (typeof params.deliveryType === "string" ? params.deliveryType : "Delivery");

  const status = cloudOrder?.status ?? (typeof params.status === "string" ? params.status : "Order Confirmed");

  const date = cloudOrder?.date ?? (typeof params.date === "string" ? params.date : "");

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "";
    }

    try {
      const orderDate = new Date(dateString);

      return orderDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const trackOrder = () => {
    router.push({
      pathname: "/track-order",
      params: {
        orderId,
        name,
        status,
        deliveryType,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Order Details
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Text style={styles.check}>✓</Text>
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {status}
            </Text>

            <Text style={styles.statusSubtitle}>
              Your order has been successfully placed.
            </Text>
          </View>
        </View>

        {/* ORDER INFORMATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Order Information
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Order ID
            </Text>

            <Text style={styles.value}>
              {orderId}
            </Text>
          </View>

          {date !== "" && (
            <>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>
                  Order Date
                </Text>

                <Text style={styles.value}>
                  {formatDate(date)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* PRODUCT DETAILS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Product Details
          </Text>

          <View style={styles.productRow}>
            <View style={styles.productIconBox}>
              <Text style={styles.productIcon}>
                🌱
              </Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {name}
              </Text>

              <Text style={styles.productPrice}>
                ₹{price.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Quantity
            </Text>

            <Text style={styles.value}>
              {quantity}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Price
            </Text>

            <Text style={styles.value}>
              ₹{price.toLocaleString("en-IN")}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Order Total
            </Text>

            <Text style={styles.totalValue}>
              ₹{total.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* PAYMENT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Payment
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Method
            </Text>

            <Text style={styles.value}>
              {paymentMethod}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.paymentStatus}>
            <Text style={styles.paymentStatusText}>
              {paymentMethod === "Cash on Delivery"
                ? "💵 Cash on Delivery"
                : "✓ Payment Selected"}
            </Text>
          </View>
        </View>

        {/* DELIVERY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Delivery Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Delivery Method
            </Text>

            <Text style={styles.value}>
              {deliveryType}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.deliveryMessage}>
            🚚 You can track the latest status of this
            order using Track Order.
          </Text>
        </View>

        {/* TRACK ORDER */}
        <TouchableOpacity
          style={styles.trackButton}
          activeOpacity={0.8}
          onPress={trackOrder}
        >
          <Text style={styles.trackButtonText}>
            Track Order
          </Text>
        </TouchableOpacity>

        {/* BACK TO MY ORDERS */}
        <TouchableOpacity
          style={styles.ordersButton}
          activeOpacity={0.8}
          onPress={() => router.replace("/my-orders")}
        >
          <Text style={styles.ordersButtonText}>
            Back to My Orders
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FFF6",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backText: {
    fontSize: 30,
    color: "#15803D",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#15803D",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    padding: 18,
    paddingBottom: 50,
  },

  statusCard: {
    backgroundColor: "#DCFCE7",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },

  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  check: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
  },

  statusSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
    lineHeight: 19,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 7,
  },

  label: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
  },

  value: {
    flex: 1.3,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 13,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  productIconBox: {
    width: 65,
    height: 65,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  productIcon: {
    fontSize: 34,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },

  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#15803D",
    marginTop: 6,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#15803D",
  },

  paymentStatus: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 10,
  },

  paymentStatusText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  deliveryMessage: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 21,
  },

  trackButton: {
    height: 55,
    backgroundColor: "#15803D",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  ordersButton: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#15803D",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  ordersButtonText: {
    color: "#15803D",
    fontSize: 17,
    fontWeight: "bold",
  },
});