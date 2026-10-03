import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import type { OrderItem, PaymentStatus } from "@/data/order-types";
import { saveOrder as persistOrder } from "@/services/orders";
import { clearCheckoutDraft } from "@/services/checkout";
import { JBS_THEME } from "@/theme/jbs-theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams();

  const [saved, setSaved] = useState(false);

  const orderId =
    typeof params.orderId === "string"
      ? params.orderId
      : `JBS${Date.now().toString().slice(-6)}`;

  const name =
    typeof params.name === "string"
      ? params.name
      : "Product";

  const price =
    typeof params.price === "string"
      ? Number(params.price)
      : 0;

  const quantity =
    typeof params.quantity === "string"
      ? Number(params.quantity)
      : 1;

  const paymentMethod =
    typeof params.paymentMethod === "string"
      ? params.paymentMethod
      : "Payment";

  const deliveryType =
    typeof params.deliveryType === "string"
      ? params.deliveryType
      : "Delivery";

  const customerName =
    typeof params.customerName === "string"
      ? params.customerName
      : undefined;

  const mobile =
    typeof params.mobile === "string"
      ? params.mobile
      : undefined;

  const address =
    typeof params.address === "string"
      ? params.address
      : undefined;

  const items = useMemo<OrderItem[]>(() => {
    if (typeof params.items !== "string") return [];
    try {
      const parsed: unknown = JSON.parse(params.items);
      return Array.isArray(parsed) ? (parsed as OrderItem[]) : [];
    } catch {
      return [];
    }
  }, [params.items]);

  const paymentStatus: PaymentStatus =
    params.paymentStatus === "cod"
      ? "cod"
      : params.paymentStatus === "paid"
      ? "paid"
      : "pending";

  const total =
    typeof params.total === "string"
      ? Number(params.total)
      : price * quantity;

  useEffect(() => {
    persistOrder({
      orderId,
      name,
      price,
      quantity,
      total,
      paymentMethod,
      paymentStatus,
      items,
      deliveryType,
      customerName,
      mobile,
      address,
      date: new Date().toISOString(),
      status: "Order Confirmed",
    })
      .then(async () => {
        await clearCheckoutDraft();
        await AsyncStorage.removeItem("jbs_cart");
        setSaved(true);
      })
      .catch((error) => console.log("Order save error:", error));
  }, [
    orderId,
    name,
    price,
    quantity,
    total,
    paymentMethod,
    paymentStatus,
    deliveryType,
    customerName,
    mobile,
    address,
    items,
  ]);

  const goHome = () => {
    router.replace("/");
  };

  const goToOrders = () => {
    router.push("/my-orders");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* SUCCESS ICON */}

        <View style={styles.successCircle}>
          <Text style={styles.checkMark}>
            ✓
          </Text>
        </View>

        {/* TITLE */}

        <Text style={styles.title}>
          Order Successful!
        </Text>

        <Text style={styles.thankYou}>
          Thank you for shopping with JBS Agri Hub
        </Text>

        <Text style={styles.message}>
          Your order has been placed successfully.
        </Text>

        {/* ORDER DETAILS */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Order Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Order ID
            </Text>

            <Text style={styles.value}>
              {orderId}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Product
            </Text>

            <Text style={styles.value}>
              {name}
            </Text>
          </View>

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

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Method
            </Text>

            <Text style={styles.value}>
              {paymentMethod}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Delivery
            </Text>

            <Text style={styles.value}>
              {deliveryType}
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

        {/* STATUS */}

        <View style={styles.paymentSuccessBox}>
          <Text style={styles.paymentSuccessText}>
            ✓ Order Confirmed
          </Text>
        </View>

        {/* SAVED STATUS */}

        <View style={styles.savedBox}>
          <Text style={styles.savedText}>
            {saved
              ? "✓ Order details saved"
              : "Saving order details..."}
          </Text>
        </View>

        {/* INFO */}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            JBS Agri Hub
          </Text>

          <Text style={styles.infoText}>
            Your order details have been saved.
          </Text>

          <Text style={styles.infoText}>
            You can check your order status from My Orders.
          </Text>
        </View>

        {/* MY ORDERS */}

        <TouchableOpacity
          style={styles.ordersButton}
          activeOpacity={0.8}
          onPress={goToOrders}
        >
          <Text style={styles.ordersButtonText}>
            View My Orders
          </Text>
        </TouchableOpacity>

        {/* CONTINUE SHOPPING */}

        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={goHome}
        >
          <Text style={styles.homeButtonText}>
            Continue Shopping
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Thank You ❤️
        </Text>

        <Text style={styles.footerBrand}>
          JBS AGRI HUB
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: JBS_THEME.colors.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 40,
    alignItems: "center",
  },

  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: JBS_THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  checkMark: {
    color: "#FFFFFF",
    fontSize: 60,
    fontWeight: "bold",
    marginTop: -5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: JBS_THEME.colors.primarySoft,
    textAlign: "center",
  },

  thankYou: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
    color: JBS_THEME.colors.text,
    textAlign: "center",
  },

  message: {
    marginTop: 6,
    fontSize: 14,
    color: JBS_THEME.colors.textSecondary,
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    width: "100%",
    backgroundColor: JBS_THEME.colors.surface,
    borderRadius: 18,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: JBS_THEME.colors.text,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 8,
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
    color: JBS_THEME.colors.text,
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: JBS_THEME.colors.text,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: JBS_THEME.colors.primarySoft,
  },

  paymentSuccessBox: {
    width: "100%",
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: JBS_THEME.colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 20,
  },

  paymentSuccessText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#166534",
  },

  savedBox: {
    width: "100%",
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: JBS_THEME.colors.surfaceElevated,
  },

  savedText: {
    textAlign: "center",
    color: JBS_THEME.colors.primarySoft,
    fontSize: 14,
    fontWeight: "bold",
  },

  infoBox: {
    width: "100%",
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    borderRadius: 15,
    padding: 17,
    marginTop: 15,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: JBS_THEME.colors.primarySoft,
    marginBottom: 7,
  },

  infoText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
  },

  ordersButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#15803D",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  ordersButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  homeButton: {
    width: "100%",
    height: 55,
    backgroundColor: JBS_THEME.colors.surface,
    borderWidth: 2,
    borderColor: "#15803D",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  homeButtonText: {
    color: JBS_THEME.colors.primarySoft,
    fontSize: 17,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },

  footerBrand: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: JBS_THEME.colors.primarySoft,
    letterSpacing: 1.5,
  },
});