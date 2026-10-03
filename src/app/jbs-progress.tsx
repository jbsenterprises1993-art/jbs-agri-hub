import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View, type DimensionValue } from "react-native";

const phases = [
  ["Foundation & architecture", 100, "Ready"],
  ["App UI foundations", 100, "Prepared"],
  ["Shared Firebase/data integration", 0, "Pending integration"],
  ["Payments, OTP & notifications", 0, "External configuration required"],
  ["Testing & Android release", 0, "Pending integration"],
];

const serviceReady = ["Stock service", "Orders service", "Roles & permissions", "Audit logging", "JBS Coin service"];\n\nconst apps = [
  ["Owner", "UI foundation"], ["Billing", "UI foundation"], ["Stock", "UI foundation"],
  ["Accounts", "UI foundation"], ["Attendance", "UI foundation"], ["Marketing", "UI foundation"],
  ["Delivery", "UI foundation"], ["Controller", "UI foundation"], ["Smart Assistant", "UI foundation"],
  ["Branch", "UI foundation"], ["Reports", "UI foundation"],
];

export default function JBSProgress() {
  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} >
      <Text style={s.brand}>JBS CONTROL CENTER</Text>
      <Text style={s.title}>Live Work Progress</Text>
      <Text style={s.sub}>Development checkpoints from the shared JBS repository</Text>
      <View style={s.summary}>
        <Text style={s.summaryTitle}>Current checkpoint</Text>
        <Text style={s.summaryValue}>Foundation verified ✓</Text>
        <Text style={s.summaryText}>Shared services are being integrated. Pull down to refresh this checkpoint.</Text>\n        <View style={s.overallRow}><Text style={s.overallLabel}>Development status</Text><Text style={s.overallValue}>{overall}%</Text></View>\n        <View style={s.overallTrack}><View style={[s.overallFill, {width: (overall + "%") as DimensionValue}]} /></View>\n        <Text style={s.updated}>Last checkpoint: {lastUpdated.toLocaleTimeString()} • refresh age {elapsed}s</Text>
      </View>
      <Text style={s.section}>Development phases</Text>
      {phases.map(([name, value, status]) => (
        <View key={name} style={s.phase}>
          <View style={s.row}><Text style={s.name}>{name}</Text><Text style={s.percent}>{value}%</Text></View>
          <View style={s.track}><View style={[s.fill, { width: (String(value) + "%") as DimensionValue }]} /></View>
          <Text style={s.status}>{status}</Text>
        </View>
      ))}
      <Text style={s.section}>Shared services</Text>\n      {serviceReady.map((item) => <View key={item} style={s.service}><Text style={s.check}>✓</Text><Text style={s.serviceText}>{item}</Text><Text style={s.ready}>READY</Text></View>)}\n      <Text style={s.section}>App workstreams</Text>
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
  dot:{width:9,height:9,borderRadius:5,backgroundColor:"#20A653",marginRight:10}, appName:{flex:1,fontWeight:"800",color:"#183027"}, appStatus:{fontSize:11,color:"#68756F"},\n  overallRow:{flexDirection:"row",justifyContent:"space-between",marginTop:18}, overallLabel:{color:"#C9D8CE",fontWeight:"800"}, overallValue:{color:"#FFFFFF",fontWeight:"900",fontSize:18}, overallTrack:{height:10,borderRadius:10,backgroundColor:"#315141",overflow:"hidden",marginTop:8}, overallFill:{height:10,borderRadius:10,backgroundColor:"#65D58A"}, updated:{fontSize:10,color:"#A8D5B5",marginTop:9}, service:{flexDirection:"row",alignItems:"center",backgroundColor:"#FFFFFF",borderRadius:14,padding:14,marginBottom:8,borderWidth:1,borderColor:"#E0E8E3"}, check:{fontWeight:"900",color:"#20A653",marginRight:10}, serviceText:{flex:1,fontWeight:"800",color:"#183027"}, ready:{fontSize:10,fontWeight:"900",color:"#20A653"}
});
