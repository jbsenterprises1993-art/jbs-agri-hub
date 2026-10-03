import React from "react";
import { ScrollView, StyleSheet, Text, View, type DimensionValue } from "react-native";

const phases = [
  ["Foundation & architecture", 100, "Ready"],
  ["App UI foundations", 100, "Prepared"],
  ["Shared Firebase/data integration", 0, "Pending integration"],
  ["Payments, OTP & notifications", 0, "External configuration required"],
  ["Testing & Android release", 0, "Pending integration"],
];

const apps = [
  ["Owner", "UI foundation"], ["Billing", "UI foundation"], ["Stock", "UI foundation"],
  ["Accounts", "UI foundation"], ["Attendance", "UI foundation"], ["Marketing", "UI foundation"],
  ["Delivery", "UI foundation"], ["Controller", "UI foundation"], ["Smart Assistant", "UI foundation"],
  ["Branch", "UI foundation"], ["Reports", "UI foundation"],
];

export default function JBSProgress() {
  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <Text style={s.brand}>JBS CONTROL CENTER</Text>
      <Text style={s.title}>Live Work Progress</Text>
      <Text style={s.sub}>Development checkpoints from the shared JBS repository</Text>
      <View style={s.summary}>
        <Text style={s.summaryTitle}>Current checkpoint</Text>
        <Text style={s.summaryValue}>Foundation verified ✓</Text>
        <Text style={s.summaryText}>TypeScript CI is passing on the ecosystem foundation branch.</Text>
      </View>
      <Text style={s.section}>Development phases</Text>
      {phases.map(([name, value, status]) => (
        <View key={name} style={s.phase}>
          <View style={s.row}><Text style={s.name}>{name}</Text><Text style={s.percent}>{value}%</Text></View>
          <View style={s.track}><View style={[s.fill, { width: (String(value) + "%") as DimensionValue }]} /></View>
          <Text style={s.status}>{status}</Text>
        </View>
      ))}
      <Text style={s.section}>App workstreams</Text>
      {apps.map(([name, status]) => (
        <View key={name} style={s.app}><View style={s.dot} /><Text style={s.appName}>{name}</Text><Text style={s.appStatus}>{status}</Text></View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:"#F5F7FB"}, content:{padding:20,paddingTop:55,paddingBottom:50},
  brand:{fontSize:12,fontWeight:"900",letterSpacing:2,color:"#176B45"}, title:{fontSize:30,fontWeight:"900",color:"#10251C",marginTop:6},
  sub:{color:"#68756F",marginTop:5,marginBottom:20}, summary:{backgroundColor:"#102A1D",borderRadius:20,padding:20},
  summaryTitle:{color:"#A8D5B5",fontSize:12,fontWeight:"800"}, summaryValue:{color:"#FFFFFF",fontSize:22,fontWeight:"900",marginTop:5},
  summaryText:{color:"#C9D8CE",lineHeight:19,marginTop:8}, section:{fontSize:19,fontWeight:"900",color:"#183027",marginTop:24,marginBottom:10},
  phase:{backgroundColor:"#FFFFFF",borderRadius:16,padding:15,marginBottom:10,borderWidth:1,borderColor:"#E0E8E3"},
  row:{flexDirection:"row",justifyContent:"space-between",gap:10}, name:{flex:1,fontWeight:"800",color:"#183027"},
  percent:{fontWeight:"900",color:"#176B45"}, track:{height:8,borderRadius:8,backgroundColor:"#E5ECE8",overflow:"hidden",marginTop:10},
  fill:{height:8,borderRadius:8,backgroundColor:"#20A653"}, status:{fontSize:11,color:"#68756F",marginTop:7},
  app:{flexDirection:"row",alignItems:"center",backgroundColor:"#FFFFFF",borderRadius:14,padding:14,marginBottom:8,borderWidth:1,borderColor:"#E0E8E3"},
  dot:{width:9,height:9,borderRadius:5,backgroundColor:"#20A653",marginRight:10}, appName:{flex:1,fontWeight:"800",color:"#183027"}, appStatus:{fontSize:11,color:"#68756F"}
});
