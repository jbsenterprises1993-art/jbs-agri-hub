import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import type { Account } from "@/data/accounts-types";
import { accountBalance } from "@/services/accounts";
import { JBS_THEME } from "@/theme/jbs-theme";
const accounts: Account[] = [
  { id:"main", name:"Main Account", type:"main", openingBalance:0, active:true },
  { id:"profit", name:"Profit Account", type:"profit", openingBalance:0, active:true },
  { id:"salary", name:"Salary Account", type:"salary", openingBalance:0, active:true },
];
export default function AccountsScreen(){return <SafeAreaView style={s.safe}><View style={s.c}>
<Pressable onPress={()=>router.back()} style={s.backButton}><Text style={s.back}>← Back</Text></Pressable>
<Text style={s.e}>JBS ACCOUNTS</Text><Text style={s.t}>Accounts Foundation</Text>
<Text style={s.n}>Account contracts and balance calculation are ready. Bank integration and automated transfers require real account configuration.</Text>
{accounts.map(a=><View key={a.id} style={s.card}><View style={s.row}><Text style={s.name}>{a.name}</Text><Text style={s.badge}>{a.type.toUpperCase()}</Text></View><Text style={s.balance}>₹{accountBalance(a,[]).toLocaleString("en-IN")}</Text><Text style={s.caption}>{a.active ? "Active account" : "Inactive account"}</Text></View>)}
</View></SafeAreaView>}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:JBS_THEME.colors.background},c:{padding:JBS_THEME.spacing.lg},backButton:{alignSelf:"flex-start",paddingVertical:JBS_THEME.spacing.sm,paddingHorizontal:JBS_THEME.spacing.md,borderRadius:JBS_THEME.radius.md,backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,marginBottom:JBS_THEME.spacing.lg},back:{color:JBS_THEME.colors.primarySoft,fontSize:15,fontWeight:"800"},e:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2},t:{color:JBS_THEME.colors.text,fontSize:28,fontWeight:"900",marginTop:4},n:{color:JBS_THEME.colors.textSecondary,fontSize:12,lineHeight:18,marginVertical:JBS_THEME.spacing.lg},card:{backgroundColor:JBS_THEME.colors.surface,borderRadius:JBS_THEME.radius.lg,borderWidth:1,borderColor:JBS_THEME.colors.border,padding:JBS_THEME.spacing.lg,marginBottom:JBS_THEME.spacing.md},row:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},name:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900"},badge:{color:JBS_THEME.colors.primarySoft,fontSize:10,fontWeight:"900",letterSpacing:1,backgroundColor:JBS_THEME.colors.surfaceElevated,paddingHorizontal:8,paddingVertical:5,borderRadius:JBS_THEME.radius.sm},balance:{color:JBS_THEME.colors.primary,fontSize:25,fontWeight:"900",marginTop:JBS_THEME.spacing.md},caption:{color:JBS_THEME.colors.textMuted,fontSize:11,marginTop:4}});