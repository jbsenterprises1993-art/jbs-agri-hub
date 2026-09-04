import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CheckoutScreen() {
  const params = useLocalSearchParams();

  const [deliveryType, setDeliveryType] = useState("");
  const [transport, setTransport] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const name =
    typeof params.name === "string"
      ? params.name
      : "Petrol Power Sprayer";

  const price =
    typeof params.price === "string"
      ? Number(params.price)
      : 0;

  const quantity =
    typeof params.quantity === "string"
      ? Number(params.quantity)
      : 1;

  const total =
    typeof params.total === "string"
      ? Number(params.total)
      : price * quantity;

  const canContinue =
    deliveryType === "pickup" ||
    (deliveryType === "transport" &&
      transport !== "" &&
      customerName.trim() !== "" &&
      mobile.trim().length === 10 &&
      address.trim() !== "");

  const selectDelivery = (type: string) => {
    setDeliveryType(type);

    if (type === "pickup") {
      setTransport("");
      setCustomerName("");
      setMobile("");
      setAddress("");
    }
  };

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    router.push({
      pathname: "/payment",
      params: {
        name: name,
        price: String(price),
        quantity: String(quantity),
        total: String(total),
        deliveryType: deliveryType,
        transport: transport,
        customerName: customerName,
        mobile: mobile,
        address: address,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Checkout</Text>

        <View style={{ width: 35 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ORDER SUMMARY */}
        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        <View style={styles.card}>
          <Text style={styles.productName}>
            {name}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Price
            </Text>

            <Text style={styles.value}>
              ₹{price.toLocaleString("en-IN")}
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

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>
              Total Amount
            </Text>

            <Text style={styles.total}>
              ₹{total.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* DELIVERY */}
        <Text style={styles.sectionTitle}>
          Delivery
        </Text>

        <View style={styles.card}>
          <Text style={styles.deliveryText}>
            Choose Delivery Method
          </Text>

          {/* JBS SHOP PICKUP */}
          <TouchableOpacity
            style={[
              styles.deliveryOption,
              deliveryType === "pickup" &&
                styles.selectedOption,
            ]}
            onPress={() => selectDelivery("pickup")}
          >
            <View style={styles.optionRow}>
              <Text style={styles.optionIcon}>
                🏪
              </Text>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>
                  JBS Shop Pickup
                </Text>

                <Text style={styles.optionText}>
                  Collect your order directly from
                  JBS shop
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  deliveryType === "pickup" &&
                    styles.radioOuterSelected,
                ]}
              >
                {deliveryType === "pickup" && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* SELECT TRANSPORT */}
          <TouchableOpacity
            style={[
              styles.deliveryOption,
              deliveryType === "transport" &&
                styles.selectedOption,
            ]}
            onPress={() =>
              selectDelivery("transport")
            }
          >
            <View style={styles.optionRow}>
              <Text style={styles.optionIcon}>
                🚚
              </Text>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>
                  Select Transport
                </Text>

                <Text style={styles.optionText}>
                  Send your order through transport
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  deliveryType === "transport" &&
                    styles.radioOuterSelected,
                ]}
              >
                {deliveryType === "transport" && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* TRANSPORT OPTIONS */}
        {deliveryType === "transport" && (
          <>
            <Text style={styles.sectionTitle}>
              Select Transport
            </Text>

            <View style={styles.card}>
              {/* MSS TRANSPORT */}
              <TouchableOpacity
                style={[
                  styles.transportOption,
                  transport === "MSS Transport" &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  setTransport("MSS Transport")
                }
              >
                <View style={styles.optionRow}>
                  <Text style={styles.transportIcon}>
                    🚛
                  </Text>

                  <Text style={styles.transportName}>
                    MSS Transport
                  </Text>

                  <View
                    style={[
                      styles.radioOuter,
                      transport === "MSS Transport" &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {transport === "MSS Transport" && (
                      <View
                        style={styles.radioInner}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {/* VRL TRANSPORT */}
              <TouchableOpacity
                style={[
                  styles.transportOption,
                  transport === "VRL Transport" &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  setTransport("VRL Transport")
                }
              >
                <View style={styles.optionRow}>
                  <Text style={styles.transportIcon}>
                    🚚
                  </Text>

                  <Text style={styles.transportName}>
                    VRL Transport
                  </Text>

                  <View
                    style={[
                      styles.radioOuter,
                      transport === "VRL Transport" &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {transport === "VRL Transport" && (
                      <View
                        style={styles.radioInner}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* DELIVERY ADDRESS */}
            <Text style={styles.sectionTitle}>
              Delivery Address
            </Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>
                Customer Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter customer name"
                placeholderTextColor="#9CA3AF"
                value={customerName}
                onChangeText={setCustomerName}
              />

              <Text style={styles.inputLabel}>
                Mobile Number
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter 10 digit mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />

              <Text style={styles.inputLabel}>
                Full Delivery Address
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.addressInput,
                ]}
                placeholder="House / Shop, Street, Village, City, District, Pincode"
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </>
        )}

        {/* PICKUP MESSAGE */}
        {deliveryType === "pickup" && (
          <View style={styles.pickupMessage}>
            <Text style={styles.pickupTitle}>
              ✓ JBS Shop Pickup Selected
            </Text>

            <Text style={styles.pickupText}>
              Your order will be prepared for pickup
              at JBS shop.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM */}
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
          disabled={!canContinue}
          style={[
            styles.continueButton,
            !canContinue &&
              styles.disabledButton,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    fontSize: 30,
    color: "#166534",
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
  },

  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222222",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },

  label: {
    fontSize: 16,
    color: "#777777",
  },

  value: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222222",
  },

  line: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
  },

  total: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#166534",
  },

  deliveryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 5,
  },

  deliveryOption: {
    marginTop: 15,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },

  selectedOption: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#166534",
  },

  optionText: {
    fontSize: 13,
    color: "#777777",
    marginTop: 5,
    lineHeight: 19,
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

  radioOuterSelected: {
    borderColor: "#16A34A",
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
  },

  transportOption: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
  },

  transportIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  transportName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#166534",
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
    color: "#222222",
    marginBottom: 12,
  },

  addressInput: {
    minHeight: 110,
  },

  pickupMessage: {
    backgroundColor: "#DCFCE7",
    borderRadius: 15,
    padding: 18,
    marginTop: 5,
    marginBottom: 20,
  },

  pickupTitle: {
    color: "#166534",
    fontSize: 17,
    fontWeight: "bold",
  },

  pickupText: {
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

  continueButton: {
    backgroundColor: "#166534",
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  disabledButton: {
    opacity: 0.4,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});