import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import type { OrderStatus } from "@/data/order-types";
import { getOrderById } from "@/services/orders";
import { JBS_THEME } from "@/theme/jbs-theme";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Step = {
  title: OrderStatus;
  description: string;
  icon: string;
};

export default function TrackOrderScreen() {
  const params = useLocalSearchParams();

  // ORDER ID
  const orderId =
    typeof params.orderId === "string"
      ? params.orderId
      : "JBS Order";

  // CURRENT STATUS
  const status: OrderStatus =
    typeof params.status === "string"
      ? normalizeStatus(params.status)
      : "Order Confirmed";

  const [liveStatus, setLiveStatus] = useState<OrderStatus>(status);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getOrderById(orderId).then((order) => {
        if (active && order) setLiveStatus(order.status);
      });
      return () => {
        active = false;
      };
    }, [orderId]),
  );

  const currentStep = getCurrentStep(liveStatus);

  const steps: Step[] = [
    {
      title: "Order Confirmed",
      description: "Your order has been successfully placed.",
      icon: "✓",
    },
    {
      title: "Order Processing",
      description: "Your product is being prepared.",
      icon: "📦",
    },
    {
      title: "Shipped",
      description: "Your order has been handed over for delivery.",
      icon: "🚚",
    },
    {
      title: "Delivered",
      description: "Your order has been delivered successfully.",
      icon: "🏠",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BACK BUTTON */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.title}>🚚 Track Order</Text>

        {/* ORDER ID CARD */}

        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>Order ID</Text>

          <Text style={styles.orderId}>
            {orderId}
          </Text>
        </View>

        {/* TRACKING CARD */}

        <View style={styles.trackingCard}>
          {steps.map((step, index) => {
            const completed = index <= currentStep;

            return (
              <View key={step.title}>
                <View style={styles.stepRow}>
                  {/* ICON */}

                  <View style={styles.leftSide}>
                    <View
                      style={[
                        styles.iconCircle,
                        completed && styles.activeCircle,
                      ]}
                    >
                      <Text style={styles.icon}>
                        {completed ? "✓" : step.icon}
                      </Text>
                    </View>

                    {/* VERTICAL LINE */}

                    {index !== steps.length - 1 && (
                      <View
                        style={[
                          styles.line,
                          index < currentStep &&
                            styles.activeLine,
                        ]}
                      />
                    )}
                  </View>

                  {/* STATUS DETAILS */}

                  <View style={styles.stepContent}>
                    <Text
                      style={[
                        styles.stepTitle,
                        completed &&
                          styles.activeTitle,
                      ]}
                    >
                      {step.title}
                    </Text>

                    <Text style={styles.description}>
                      {step.description}
                    </Text>

                    {index === currentStep && (
                      <View style={styles.currentBadge}>
                        <Text
                          style={styles.currentBadgeText}
                        >
                          Current Status
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* HOME BUTTON */}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.homeButtonText}>
            🏠 Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================================
   STATUS NORMALIZATION
================================ */

function normalizeStatus(
  value: string
): OrderStatus {
  const status = value
    .trim()
    .toLowerCase();

  if (
    status === "processing" ||
    status === "order processing"
  ) {
    return "Order Processing";
  }

  if (status === "shipped") {
    return "Shipped";
  }

  if (status === "delivered") {
    return "Delivered";
  }

  return "Order Confirmed";
}

/* ================================
   CURRENT STEP
================================ */

function getCurrentStep(
  status: OrderStatus
) {
  switch (status) {
    case "Order Confirmed":
      return 0;

    case "Order Processing":
      return 1;

    case "Shipped":
      return 2;

    case "Delivered":
      return 3;

    default:
      return 0;
  }
}

/* ================================
   STYLES
================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JBS_THEME.colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  backButton: {
    marginTop: 5,
    marginBottom: 10,
  },

  backText: {
    fontSize: 17,
    fontWeight: "700",
    color: JBS_THEME.colors.primarySoft,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: JBS_THEME.colors.primarySoft,
    marginBottom: 30,
  },

  orderCard: {
    backgroundColor: JBS_THEME.colors.surface,
    borderRadius: 25,
    padding: 25,
    marginBottom: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  orderLabel: {
    fontSize: 17,
    color: JBS_THEME.colors.textSecondary,
    fontWeight: "600",
    marginBottom: 20,
  },

  orderId: {
    fontSize: 27,
    fontWeight: "900",
    color: JBS_THEME.colors.text,
  },

  trackingCard: {
    backgroundColor: JBS_THEME.colors.surface,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },

  stepRow: {
    flexDirection: "row",
    minHeight: 150,
  },

  leftSide: {
    width: 75,
    alignItems: "center",
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: JBS_THEME.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  activeCircle: {
    backgroundColor: JBS_THEME.colors.primary,
  },

  icon: {
    fontSize: 31,
    color: "#FFFFFF",
    fontWeight: "900",
  },

  line: {
    width: 4,
    flex: 1,
    backgroundColor: JBS_THEME.colors.border,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 5,
  },

  activeLine: {
    backgroundColor: JBS_THEME.colors.primary,
  },

  stepContent: {
    flex: 1,
    paddingLeft: 15,
    paddingTop: 5,
  },

  stepTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#6B7280",
    marginBottom: 12,
  },

  activeTitle: {
    color: JBS_THEME.colors.primarySoft,
  },

  description: {
    fontSize: 16,
    lineHeight: 25,
    color: JBS_THEME.colors.textSecondary,
    fontWeight: "500",
  },

  currentBadge: {
    alignSelf: "flex-start",
    backgroundColor: JBS_THEME.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  currentBadgeText: {
    color: JBS_THEME.colors.primarySoft,
    fontSize: 13,
    fontWeight: "800",
  },

  homeButton: {
    backgroundColor: "#07883F",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 25,
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});