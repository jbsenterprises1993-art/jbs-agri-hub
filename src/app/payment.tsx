import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { JBS_THEME } from "@/theme/jbs-theme";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const params = useLocalSearchParams();

  const [paymentMethod, setPaymentMethod] = useState("");

  const name =
    typeof params.name === "string"
      ? params.name
      : "Petrol Power Sprayer";

  const quantity =
    typeof params.quantity === "string"
      ? Number(params.quantity)
      : 1;

  const total =
    typeof params.total === "string"
      ? Number(params.total)
      : 0;

  const deliveryType =
    typeof params.deliveryType === "string"
      ? params.deliveryType
      : "";

  const transport =
    typeof params.transport === "string"
      ? params.transport
      : "";

  const canPay = paymentMethod === "cod";

  const handlePayment = () => {
    if (!canPay) {
      return;
    }

    const orderId = `JBS${Date.now()
      .toString()
      .slice(-6)}`;

    const unitPrice =
      quantity > 0
        ? total / quantity
        : total;

    router.replace({
      pathname: "/order-success",
      params: {
        orderId: orderId,
        name: name,
        quantity: String(quantity),
        price: String(unitPrice),
        total: String(total),

        paymentMethod:
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : "UPI Payment",

        deliveryType:
          deliveryType === "pickup"
            ? "JBS Shop Pickup"
            : transport !== ""
            ? transport
            : "Transport",
        customerName:
          typeof params.customerName === "string"
            ? params.customerName
            : "",
        mobile:
          typeof params.mobile === "string"
            ? params.mobile
            : "",
        address:
          typeof params.address === "string"
            ? params.address
            : "",
        paymentStatus: "cod",
        items:
          typeof params.items === "string"
            ? params.items
            : "[]",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Payment
        </Text>

        <View style={{ width: 35 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ORDER DETAILS */}

        <Text style={styles.sectionTitle}>
          Order Details
        </Text>

        <View style={styles.card}>
          <Text style={styles.productName}>
            {name}
          </Text>

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
              Delivery
            </Text>

            <Text style={styles.value}>
              {deliveryType === "pickup"
                ? "JBS Shop Pickup"
                : "Transport"}
            </Text>
          </View>

          {deliveryType === "transport" &&
            transport !== "" && (
              <View style={styles.row}>
                <Text style={styles.label}>
                  Transport
                </Text>

                <Text style={styles.value}>
                  {transport}
                </Text>
              </View>
            )}

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              ₹{total.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* PAYMENT METHOD */}

        <Text style={styles.sectionTitle}>
          Select Payment Method
        </Text>

        <View style={styles.card}>
          {/* UPI */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.paymentOption,
              styles.disabledPaymentOption,
            ]}
            disabled
            onPress={() => undefined}
          >
            <View style={styles.paymentRow}>
              <Text style={styles.paymentIcon}>
                📱
              </Text>

              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>
                  UPI Payment
                </Text>

                <Text style={styles.paymentText}>
                  Gateway integration pending — UPI is not enabled yet
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === "upi" &&
                    styles.radioSelected,
                ]}
              >
                {false && paymentMethod === "upi" && (
                  <View
                    style={styles.radioInner}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* CASH ON DELIVERY */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.paymentOption,
              paymentMethod === "cod" &&
                styles.selectedOption,
            ]}
            onPress={() =>
              setPaymentMethod("cod")
            }
          >
            <View style={styles.paymentRow}>
              <Text style={styles.paymentIcon}>
                💵
              </Text>

              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>
                  Cash on Delivery
                </Text>

                <Text style={styles.paymentText}>
                  Pay when your order is delivered
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === "cod" &&
                    styles.radioSelected,
                ]}
              >
                {paymentMethod === "cod" && (
                  <View
                    style={styles.radioInner}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* UPI INFO */}

        {/* COD INFO */}

        {paymentMethod === "cod" && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              Cash on Delivery Selected
            </Text>

            <Text style={styles.infoText}>
              Your order will be placed as a
              Cash on Delivery order.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM PAYMENT BAR */}

      <View style={styles.bottom}>
        <View>
          <Text style={styles.payLabel}>
            Payable Amount
          </Text>

          <Text style={styles.payTotal}>
            ₹{total.toLocaleString("en-IN")}
          </Text>
        </View>

        <TouchableOpacity
          disabled={!canPay}
          activeOpacity={0.8}
          style={[
            styles.payButton,
            !canPay &&
              styles.disabledButton,
          ]}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>
            {paymentMethod === "cod"
              ? "Place Order"
              : "UPI Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JBS_THEME.colors.background,
  },

  header: {
    backgroundColor: JBS_THEME.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    fontSize: 30,
    color: JBS_THEME.colors.primarySoft,
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#166534",
  },

  content: {
    padding: 20,
    paddingBottom: 140,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
    marginTop: 15,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: JBS_THEME.colors.text,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },

  label: {
    fontSize: 15,
    color: JBS_THEME.colors.textSecondary,
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222222",
    maxWidth: "60%",
    textAlign: "right",
  },

  line: {
    height: 1,
    backgroundColor: JBS_THEME.colors.border,
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
  },

  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
  },

  disabledPaymentOption: {
    opacity: 0.55,
  },

  paymentOption: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: JBS_THEME.colors.surfaceElevated,
  },

  selectedOption: {
    borderColor: JBS_THEME.colors.primary,
    backgroundColor: JBS_THEME.colors.surfaceElevated,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#166534",
  },

  paymentText: {
    fontSize: 13,
    color: "#777777",
    marginTop: 5,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  radioSelected: {
    borderColor: "#16A34A",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
  },

  infoBox: {
    backgroundColor: "#DCFCE7",
    borderRadius: 15,
    padding: 18,
    marginTop: 5,
  },

  infoTitle: {
    color: "#166534",
    fontSize: 17,
    fontWeight: "bold",
  },

  infoText: {
    color: "#4B5563",
    fontSize: 14,
    marginTop: 7,
    lineHeight: 20,
  },

  bottom: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  payLabel: {
    fontSize: 13,
    color: "#777777",
  },

  payTotal: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#166534",
  },

  payButton: {
    backgroundColor: "#166534",
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  disabledButton: {
    opacity: 0.4,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});