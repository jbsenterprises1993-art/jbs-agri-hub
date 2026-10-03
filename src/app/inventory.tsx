import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { InventoryItem } from "@/data/inventory-types";
import { getInventory, saveInventory, getStockMovements, recordStockMovement } from "@/services/inventory-storage";
import type { StockMovement } from "@/data/inventory-types";
import { isLowStock } from "@/services/inventory";

const demoItems: InventoryItem[] = [
  { productId: "sprayer-01", productName: "Petrol Power Sprayer", sku: "JBS-PS-01", quantity: 12, lowStockLimit: 5, highStockLimit: 30, purchaseRate: 9500, gstPercent: 18, active: true },
  { productId: "weeder-01", productName: "Power Weeder", sku: "JBS-PW-01", quantity: 4, lowStockLimit: 5, highStockLimit: 20, purchaseRate: 42000, gstPercent: 18, active: true },
];

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const load = useCallback(async () => {
    const stored = await getInventory();
    setMovements(await getStockMovements());
    if (stored.length === 0) {
      await saveInventory(demoItems);
      setItems(demoItems);
    } else {
      setItems(stored);
    }
    setLoaded(true);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const updateQty = async (id: string, delta: number) => {
    const next = items.map(item => item.productId === id
      ? { ...item, quantity: Math.max(0, item.quantity + delta) }
      : item);
    setItems(next);
    await saveInventory(next);
    const item = items.find(entry => entry.productId === id);
    if (item) {
      await recordStockMovement({
        id: `${id}-${Date.now()}`,
        productId: id,
        type: delta > 0 ? "purchase" : "sale",
        quantity: Math.abs(delta),
        unitRate: item.purchaseRate,
        createdAt: new Date().toISOString(),
      });
      setMovements(await getStockMovements());
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>JBS INVENTORY</Text>
        <Text style={styles.title}>Stock Control</Text>
        <Text style={styles.sub}>Local inventory foundation • low-stock limits included</Text>\n        <View style={styles.summaryRow}>\n          <Text style={styles.summary}>Low stock: {lowStockCount} • Movements: {movements.length}</Text>\n          <Pressable onPress={load} accessibilityRole="button"><Text style={styles.reload}>↻ Reload</Text></Pressable>\n        </View>
        {loaded && items.map(item => (
          <View key={item.productId} style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.productName}</Text>
                <Text style={styles.meta}>{item.sku ?? "No SKU"} • GST {item.gstPercent}%</Text>
              </View>
              <Text style={[styles.qty, isLowStock(item) && styles.low]}>{item.quantity}</Text>
            </View>
            <View style={styles.controls}>
              <Pressable style={styles.button} onPress={() => updateQty(item.productId, -1)}><Text style={styles.buttonText}>−</Text></Pressable>
              <Text style={styles.limit}>Low stock: {item.lowStockLimit}</Text>
              <Pressable style={styles.button} onPress={() => updateQty(item.productId, 1)}><Text style={styles.buttonText}>+</Text></Pressable>
            </View>
          </View>
        ))}
        <Text style={styles.note}>Production stock sync, purchase entries and cloud inventory are still release work.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#071A12"},container:{padding:18,paddingBottom:40},back:{color:"#6ED99A",fontSize:17,fontWeight:"800",marginBottom:22},
  eyebrow:{color:"#6ED99A",fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:"#FFF",fontSize:30,fontWeight:"900",marginTop:4},
  sub:{color:"#9BC7A9",fontSize:12,lineHeight:18,marginTop:6,marginBottom:18},card:{backgroundColor:"#102A1D",borderRadius:18,padding:16,marginBottom:12},
  row:{flexDirection:"row",alignItems:"center"},name:{color:"#FFF",fontSize:16,fontWeight:"900"},meta:{color:"#8EAE99",fontSize:11,marginTop:4},
  qty:{color:"#6ED99A",fontSize:28,fontWeight:"900"},low:{color:"#FFD166"},controls:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:14},
  button:{width:42,height:38,borderRadius:12,backgroundColor:"#18352A",alignItems:"center",justifyContent:"center"},buttonText:{color:"#FFF",fontSize:22,fontWeight:"900"},
  limit:{color:"#9BC7A9",fontSize:11},summaryRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:14},summary:{color:"#6ED99A",fontSize:12,fontWeight:"800"},reload:{color:"#FFFFFF",fontSize:12,fontWeight:"800"},note:{color:"#718D7B",fontSize:11,lineHeight:17,marginTop:8}
});
