import React from "react";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const apps = [
  ["Owner","owner-app"],["Billing","billing-app"],["Stock","stock-app"],["Accounts","accounts-app"],
  ["Attendance","attendance-app"],["Marketing","marketing-app"],["Delivery","delivery-app"],["Controller","controller-app"],
  ["Smart Assistant","ai-app"],["Branch","branch-app"],["Reports","reports-app"]
];

export default function JBSEcosystem() {
 return <ScrollView style={s.root} contentContainerStyle={s.content}>
  <Text style={s.brand}>JBS ECOSYSTEM</Text><Text style={s.title}>All Apps Control Hub</Text>
  <Text style={s.sub}>Tamil-first • mobile-first • shared JBS workflow</Text>
  <View style={s.grid}>{apps.map(([name,path])=><Link key={path} href={"/"+path} style={s.card}><Text style={s.name}>{name}</Text><Text style={s.open}>Open →</Text></Link>)}</View>
  <View style={s.note}><Text style={s.noteTitle}>Build status</Text><Text style={s.noteText}>UI modules and navigation foundations are prepared. Firebase, payment gateways, SMS/OTP, production notifications and store release still require their external credentials/configuration.</Text></View>
 </ScrollView>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:"#F5F7FB"},content:{padding:20,paddingTop:55,paddingBottom:50},brand:{fontSize:12,fontWeight:"900",letterSpacing:2,color:"#176B45"},title:{fontSize:30,fontWeight:"900",color:"#10251C",marginTop:6},sub:{color:"#68756F",marginTop:5,marginBottom:22},grid:{flexDirection:"row",flexWrap:"wrap",gap:10},card:{width:"48%",minHeight:92,backgroundColor:"#fff",borderRadius:18,padding:15,borderWidth:1,borderColor:"#E0E8E3",justifyContent:"space-between"},name:{fontSize:16,fontWeight:"800",color:"#183027"},open:{fontSize:12,color:"#176B45"},note:{marginTop:22,padding:16,borderRadius:16,backgroundColor:"#EEF8F2"},noteTitle:{fontWeight:"900",color:"#176B45",marginBottom:5},noteText:{fontSize:12,lineHeight:18,color:"#52665D"}});
