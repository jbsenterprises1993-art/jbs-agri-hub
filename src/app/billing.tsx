import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { calculateInvoice } from "@/services/billing";
import type { InvoiceItem } from "@/data/billing-types";

export default function BillingScreen() {
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("12500");
  const item: InvoiceItem = { id:"demo", name:"Petrol Power Sprayer", quantity:Math.max(1, Number(qty)||1), unitPrice:Math.max(0, Number(price)||0), gstPercent:18 };
  const totals = useMemo(() => calculateInvoice([item]), [item.quantity, item.unitPrice]);
  return <SafeAreaView style={styles.safe}><View style={styles.container}>
    <Pressable onPress={() => router.back()}><Text style={styles.back}>← Back</Text></Pressable>
    <Text style={styles.eyebrow}>JBS BILLING</Text><Text style={styles.title}>Invoice Foundation</Text>
    <Text style={styles.note}>GST calculation engine is ready. PDF generation and production invoice storage remain release work.</Text>
    <Text style={styles.label}>Quantity</Text><TextInput value={qty} onChangeText={setQty} keyboardType="numeric" style={styles.input}/>
    <Text style={styles.label}>Unit Price</Text><TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input}/>
    <View style={styles.card}><Line label="Subtotal" value={totals.subtotal}/><Line label="GST (18%)" value={totals.gstTotal}/><Line label="Grand Total" value={totals.grandTotal} strong/></View>
  </View></SafeAreaView>;
}
function Line({label,value,strong}:{label:string;value:number;strong?:boolean}){return <View style={styles.line}><Text style={[styles.lineLabel,strong&&styles.strong]}>{label}</Text><Text style={[styles.value,strong&&styles.strong]}>₹{value.toLocaleString("en-IN",{maximumFractionDigits:2})}</Text></View>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:"#071A12"},container:{padding:18},back:{color:"#6ED99A",fontSize:17,fontWeight:"800",marginBottom:22},eyebrow:{color:"#6ED99A",fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:"#FFF",fontSize:28,fontWeight:"900",marginTop:4},note:{color:"#9BC7A9",fontSize:12,lineHeight:18,marginVertical:16},label:{color:"#C9D8CE",fontWeight:"800",fontSize:12,marginTop:10},input:{backgroundColor:"#102A1D",color:"#FFF",borderRadius:12,padding:13,marginTop:6},card:{backgroundColor:"#102A1D",borderRadius:18,padding:16,marginTop:18},line:{flexDirection:"row",justifyContent:"space-between",paddingVertical:10,borderBottomWidth:1,borderBottomColor:"#1D4030"},lineLabel:{color:"#9BC7A9"},value:{color:"#FFF",fontWeight:"800"},strong:{color:"#6ED99A",fontWeight:"900"}});
