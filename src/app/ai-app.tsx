import React,{useState} from "react";
import {Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
export default function SmartAssistantApp(){
 const [q,setQ]=useState(""); const [out,setOut]=useState("Ask about sales, stock, products, reports or marketing content.");
 return <ScrollView contentContainerStyle={s.c}><Text style={s.b}>JBS SMART ASSISTANT</Text><Text style={s.t}>Business Assistant</Text><Text style={s.sub}>Tamil / English • local UI ready</Text>
 <View style={s.card}><Text style={s.label}>Your question</Text><TextInput value={q} onChangeText={setQ} placeholder="உங்கள் கேள்வியை எழுதுங்கள்..." style={s.input}/><Pressable style={s.btn} onPress={()=>setOut(q ? "JBS workspace note: " + q + " — connect your approved AI provider for a live answer." : "Please enter a question.")}><Text style={s.bt}>Ask JBS</Text></Pressable><Text style={s.out}>{out}</Text></View>
 </ScrollView>
}
const s=StyleSheet.create({c:{padding:20,paddingTop:55,backgroundColor:"#F5F7FB",flexGrow:1},b:{fontSize:12,fontWeight:"900",letterSpacing:2,color:"#176B45"},t:{fontSize:30,fontWeight:"900",marginTop:6,color:"#10251C"},sub:{color:"#68756F",marginTop:5,marginBottom:22},card:{backgroundColor:"#fff",padding:18,borderRadius:18,borderWidth:1,borderColor:"#E0E8E3"},label:{fontWeight:"800",marginBottom:8},input:{borderWidth:1,borderColor:"#D9E3DE",borderRadius:12,padding:14,minHeight:90,textAlignVertical:"top"},btn:{backgroundColor:"#176B45",padding:14,borderRadius:12,marginTop:12},bt:{color:"#fff",textAlign:"center",fontWeight:"900"},out:{marginTop:16,color:"#42564D",lineHeight:20}});
