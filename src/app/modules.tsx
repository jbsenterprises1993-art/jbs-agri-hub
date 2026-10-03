import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { JBS_ECOSYSTEM } from "@/data/jbs-ecosystem";

const routes: Record<string, string> = {
  "agri-hub": "/",
  owner: "/owner-dashboard",
  orchestrator: "/live-progress",
  billing: "/billing",
  accounts: "/accounts",
  attendance: "/attendance",
  marketing: "/marketing",
  delivery: "/delivery",
  ai: "/ai-assistant",
};

export default function ModulesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>← Back</Text></Pressable>
        <Text style={styles.eyebrow}>JBS ECOSYSTEM</Text>
        <Text style={styles.title}>All Apps Control</Text>
        <Text style={styles.subtitle}>Shared foundation status. Production completion is tracked separately.</Text>
        {JBS_ECOSYSTEM.map((app) => {
          const total = app.tasks.length;
          const done = app.tasks.filter((task) => task.status === "completed").length;
          const active = app.tasks.filter((task) => task.status === "in_progress").length;
          return (
            <Pressable key={app.id} style={styles.card} onPress={() => router.push(routes[app.id] as never)}>
              <View style={styles.row}>
                <View style={styles.main}>
                  <Text style={styles.name}>{app.name}</Text>
                  <Text style={styles.tamil}>{app.tamil}</Text>
                </View>
                <Text style={styles.percent}>{total ? Math.round((done / total) * 100) : 0}%</Text>
              </View>
              <View style={styles.track}><View style={[styles.fill, { width: `${total ? (done / total) * 100 : 0}%` }]} /></View>
              <Text style={styles.meta}>{done} completed • {active} in progress • {total - done - active} planned</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#071A12"},
  container:{padding:18,paddingBottom:40},
  back:{color:"#6ED99A",fontSize:17,fontWeight:"800",marginBottom:22},
  eyebrow:{color:"#6ED99A",fontSize:11,fontWeight:"900",letterSpacing:2},
  title:{color:"#FFF",fontSize:30,fontWeight:"900",marginTop:4},
  subtitle:{color:"#9BC7A9",fontSize:12,lineHeight:18,marginTop:6,marginBottom:18},
  card:{backgroundColor:"#102A1D",borderRadius:18,padding:16,marginBottom:10},
  row:{flexDirection:"row",alignItems:"center"},
  main:{flex:1},
  name:{color:"#FFF",fontSize:16,fontWeight:"900"},
  tamil:{color:"#8EAE99",fontSize:11,marginTop:3},
  percent:{color:"#6ED99A",fontSize:18,fontWeight:"900"},
  track:{height:7,backgroundColor:"#1D4030",borderRadius:8,overflow:"hidden",marginTop:13},
  fill:{height:7,backgroundColor:"#20A653",borderRadius:8},
  meta:{color:"#8EAE99",fontSize:10,marginTop:8},
});
