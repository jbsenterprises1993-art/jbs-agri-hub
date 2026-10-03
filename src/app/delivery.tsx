import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Delivery, DeliveryStatus } from "@/data/delivery-types";
import { updateDeliveryStatus } from "@/services/delivery";
import { applyDeliveryStatusToOrder } from "@/services/delivery-order";
import { getOrderById, saveOrder } from "@/services/orders";
import { getDeliveries, saveDelivery } from "@/services/delivery-storage";
import { JBS_THEME } from "@/theme/jbs-theme";

const demoDelivery: Delivery = { id:"demo", orderId:"demo", transportName:"Transport Pending", deliveryStatus:"pending", deliveryCharge:0 };
const statusFlow: DeliveryStatus[] = ["pending","assigned","picked_up","in_transit","delivered"];

export default function DeliveryScreen() {
  const [delivery, setDelivery] = useState<Delivery>(demoDelivery);

  const load = useCallback(async () => {
    const deliveries = await getDeliveries();
    const existing = deliveries.find((item) => item.id === "demo");
    setDelivery(existing || demoDelivery);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const changeStatus = async (status: DeliveryStatus) => {
    const next = updateDeliveryStatus(delivery, status);
    await saveDelivery(next);
    setDelivery(next);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button"><Text style={styles.back}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>JBS DELIVERY</Text>
        <Text style={styles.title}>Delivery Control</Text>
        <Text style={styles.note}>Delivery status can now be updated and persisted locally. Transport provider assignment and live tracking need API integration.</Text>

        <View style={styles.card}>
          <Text style={styles.section}>Order {delivery.orderId}</Text>
          <Text style={styles.label}>Current Status</Text>
          <Text style={styles.status}>{delivery.deliveryStatus.replace("_"," ").toUpperCase()}</Text>
          <Text style={styles.label}>Transport</Text>
          <Text style={styles.value}>{delivery.transportName}</Text>
          <Text style={styles.label}>Delivery Charge</Text>
          <Text style={styles.value}>₹{delivery.deliveryCharge.toLocaleString("en-IN")}</Text>
          {delivery.deliveredAt ? <Text style={styles.caption}>Delivered: {new Date(delivery.deliveredAt).toLocaleString("en-IN")}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Update Status</Text>
          {statusFlow.map((status) => (
            <Pressable key={status} onPress={() => changeStatus(status)} style={[styles.statusButton, delivery.deliveryStatus === status && styles.statusActive]} accessibilityRole="button">
              <Text style={delivery.deliveryStatus === status ? styles.statusTextActive : styles.statusText}>{status.replace("_"," ")}</Text>
            </Pressable>
          ))}
          <Pressable onPress={() => changeStatus("cancelled")} style={[styles.statusButton, delivery.deliveryStatus === "cancelled" && styles.cancelActive]} accessibilityRole="button">
            <Text style={delivery.deliveryStatus === "cancelled" ? styles.cancelTextActive : styles.statusText}>cancelled</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:JBS_THEME.colors.background},container:{padding:JBS_THEME.spacing.lg,paddingBottom:40},
  backButton:{alignSelf:"flex-start",paddingVertical:JBS_THEME.spacing.sm,paddingHorizontal:JBS_THEME.spacing.md,borderRadius:JBS_THEME.radius.md,backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,marginBottom:JBS_THEME.spacing.lg},
  back:{color:JBS_THEME.colors.primarySoft,fontSize:15,fontWeight:"800"},eyebrow:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:JBS_THEME.colors.text,fontSize:28,fontWeight:"900",marginTop:4},
  note:{color:JBS_THEME.colors.textSecondary,fontSize:12,lineHeight:18,marginVertical:JBS_THEME.spacing.lg},card:{backgroundColor:JBS_THEME.colors.surface,borderRadius:JBS_THEME.radius.lg,borderWidth:1,borderColor:JBS_THEME.colors.border,padding:JBS_THEME.spacing.lg,marginBottom:JBS_THEME.spacing.md},
  section:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900",marginBottom:8},label:{color:JBS_THEME.colors.textMuted,fontSize:11,fontWeight:"800",marginTop:JBS_THEME.spacing.md},status:{color:JBS_THEME.colors.warning,fontSize:18,fontWeight:"900",marginTop:4},value:{color:JBS_THEME.colors.text,fontSize:18,fontWeight:"900",marginTop:4},caption:{color:JBS_THEME.colors.textMuted,fontSize:11,marginTop:8},
  statusButton:{borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,padding:13,marginTop:8,backgroundColor:JBS_THEME.colors.background},statusActive:{borderColor:JBS_THEME.colors.primary,backgroundColor:JBS_THEME.colors.surfaceElevated},statusText:{color:JBS_THEME.colors.textSecondary,fontWeight:"800",textTransform:"capitalize"},statusTextActive:{color:JBS_THEME.colors.primarySoft,fontWeight:"900",textTransform:"capitalize"},cancelActive:{borderColor:JBS_THEME.colors.danger,backgroundColor:JBS_THEME.colors.surfaceElevated},cancelTextActive:{color:JBS_THEME.colors.danger,fontWeight:"900",textTransform:"capitalize"}
});