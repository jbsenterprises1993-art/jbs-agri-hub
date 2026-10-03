import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const items = ["New Delivery","Pending","In Transit","Delivered","Transport","Delivery Charge","Tracking"];
const stock = [
  { name: "Petrol Power Sprayer", stock: 24, low: 5, max: 50, purchase: 9200, sale: 12500, gst: 18 },
  { name: "Power Weeder", stock: 8, low: 3, max: 20, purchase: 38000, sale: 45500, gst: 18 },
  { name: "Chaff Cutter", stock: 3, low: 5, max: 15, purchase: 14500, sale: 18900, gst: 18 },
];

export default function DeliveryApp() {
  const [selected, setSelected] = useState(items[0]);
  const [language, setLanguage] = useState<"TA"|"EN">("TA");
  const [detail, setDetail] = useState(false);
  const titleTa = "JBS Delivery App";
  const subtitle = useMemo(() => language === "TA" ? "JBS Ecosystem • செயல்படும் module" : "JBS Ecosystem • Working module", [language]);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View><Text style={styles.brand}>JBS</Text><Text style={styles.title}>{titleTa}</Text><Text style={styles.sub}>{subtitle}</Text></View>
          <Pressable style={styles.lang} onPress={() => setLanguage(language === "TA" ? "EN" : "TA")}><Text>{language === "TA" ? "தமிழ்" : "EN"}</Text></Pressable>
        </View>

        <View style={styles.kpis}>
          <View style={styles.kpi}><Text style={styles.kpiValue}>₹1.28L</Text><Text style={styles.kpiLabel}>Today</Text></View>
          <View style={styles.kpi}><Text style={styles.kpiValue}>24</Text><Text style={styles.kpiLabel}>Orders</Text></View>
          <View style={styles.kpi}><Text style={styles.kpiValue}>8</Text><Text style={styles.kpiLabel}>Alerts</Text></View>
        </View>

        <Text style={styles.section}>Modules</Text>
        <View style={styles.grid}>
          {items.map((item) => <Pressable key={item} onPress={() => {setSelected(item); setDetail(item.toLowerCase().includes("stock") || item === "View Details");}} style={[styles.card, selected === item && styles.cardActive]}>
            <Text style={styles.cardTitle}>{item}</Text><Text style={styles.cardHint}>Open →</Text>
          </Pressable>)}
        </View>

        {detail && <View style={styles.panel}>
          <View style={styles.panelHead}><Text style={styles.panelTitle}>Stock • View Details</Text><Pressable onPress={() => setDetail(false)}><Text>✕</Text></Pressable></View>
          {stock.map((p) => <Pressable key={p.name} style={styles.stockRow} onPress={() => setSelected(p.name)}>
            <View style={{flex:1}}><Text style={styles.stockName}>{p.name}</Text><Text style={styles.muted}>Purchase ₹{p.purchase.toLocaleString("en-IN")} • Sale ₹{p.sale.toLocaleString("en-IN")} • GST {p.gst}%</Text></View>
            <View><Text style={[styles.stockQty, p.stock <= p.low && styles.warn]}>{p.stock}</Text><Text style={styles.muted}>/ {p.max}</Text></View>
          </Pressable>)}
        </View>}

        <View style={styles.status}><Text style={styles.statusDot}>●</Text><Text style={styles.statusText}>Local UI ready • No secrets stored • Firebase/API actions remain configuration-dependent</Text></View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
 root:{flex:1,backgroundColor:"#F5F7FB"},content:{padding:18,paddingTop:52,paddingBottom:40},
 header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:20},brand:{fontSize:13,fontWeight:"800",letterSpacing:2,color:"#176B45"},title:{fontSize:27,fontWeight:"800",color:"#10251C",marginTop:3},sub:{color:"#68756F",marginTop:4},lang:{backgroundColor:"#fff",borderWidth:1,borderColor:"#D9E3DE",paddingHorizontal:14,paddingVertical:9,borderRadius:20},
 kpis:{flexDirection:"row",gap:10,marginBottom:22},kpi:{flex:1,backgroundColor:"#fff",borderRadius:16,padding:15,borderWidth:1,borderColor:"#E4EAE7"},kpiValue:{fontSize:20,fontWeight:"800",color:"#176B45"},kpiLabel:{fontSize:12,color:"#738078",marginTop:4},
 section:{fontSize:18,fontWeight:"800",marginBottom:10,color:"#18251F"},grid:{flexDirection:"row",flexWrap:"wrap",gap:10},card:{width:"48%",minHeight:82,backgroundColor:"#fff",borderRadius:16,padding:14,borderWidth:1,borderColor:"#E4EAE7",justifyContent:"space-between"},cardActive:{borderColor:"#176B45",borderWidth:2},cardTitle:{fontSize:15,fontWeight:"700",color:"#20332A"},cardHint:{fontSize:12,color:"#176B45"},
 panel:{backgroundColor:"#fff",borderRadius:18,padding:16,marginTop:18,borderWidth:1,borderColor:"#DDE7E1"},panelHead:{flexDirection:"row",justifyContent:"space-between",marginBottom:8},panelTitle:{fontSize:18,fontWeight:"800"},stockRow:{flexDirection:"row",paddingVertical:14,borderBottomWidth:1,borderBottomColor:"#EEF2F0"},stockName:{fontWeight:"700"},muted:{fontSize:11,color:"#77827D",marginTop:4},stockQty:{fontSize:20,fontWeight:"800",color:"#176B45",textAlign:"right"},warn:{color:"#C75B00"},status:{marginTop:22,flexDirection:"row",gap:8,backgroundColor:"#EEF8F2",padding:12,borderRadius:12},statusDot:{color:"#176B45"},statusText:{flex:1,fontSize:12,color:"#496057"}
});
