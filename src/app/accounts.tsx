import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { Account } from "@/data/accounts-types";
import { accountBalance } from "@/services/accounts";

const accounts: Account[] = [
  {id:"main",name:"Main Account",type:"main",openingBalance:0,active:true},
  {id:"profit",name:"Profit Account",type:"profit",openingBalance:0,active:true},
  {id:"salary",name:"Salary Account",type:"salary",openingBalance:0,active:true},
];

export default function AccountsScreen(){return <SafeAreaView style={styles.safe}><View style={styles.container}>
<Pressable onPress={()=>router.back()}><Text style={styles.back}>← Back</Text></Pressable>
<Text style={styles.eyebrow}>JBS ACCOUNTS</Text><Text style={styles.title}>Accounts Foundation</Text>
<Text style={styles.note}>Account contracts and balance calculation are ready. Bank integration and automated transfers require real account configuration.</Text>
{accounts.map(a=><View key={a.id} style={styles.card}><Text style={styles.name}>{a.name}</Text><Text style={styles.type}>{a.type.toUpperCase()}</Text><Text style={styles.balance}>₹{accountBalance(a,[]).toLocaleString("en-IN")}</Text></View>)}
</View></SafeAreaView>}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:"#071A12"},container:{padding:18},back:{color:"#6ED99A",fontSize:17,fontWeight:"800",marginBottom:22},eyebrow:{color:"#6ED99A",fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:"#FFF",fontSize:28,fontWeight:"900",marginTop:4},note:{color:"#9BC7A9",fontSize:12,lineHeight:18,marginVertical:16},card:{backgroundColor:"#102A1D",borderRadius:18,padding:16,marginBottom:10},name:{color:"#FFF",fontSize:16,fontWeight:"900"},type:{color:"#6ED99A",fontSize:10,fontWeight:"900",marginTop:3},balance:{color:"#FFF",fontSize:22,fontWeight:"900",marginTop:10}});
