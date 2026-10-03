import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { JBS_THEME } from "@/theme/jbs-theme";

const categories = [
  ["🌱","Power Sprayers",true],
  ["🚜","Power Weeders",false],
  ["⚙️","Chaff Cutters",false],
  ["🔧","Spare Parts",false],
] as const;

export default function ProductsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>JBS AGRI HUB</Text>
        <Text style={styles.title}>Our Products</Text>
        <Text style={styles.subtitle}>Premium agriculture equipment</Text>
        <View style={styles.grid}>
          {categories.map(([icon,name,active]) => (
            <Pressable key={name} disabled={!active} onPress={() => active && router.push("/sprayers")} style={[styles.card,!active && styles.disabledCard]}>
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.product}>{name}</Text>
              <Text style={styles.action}>{active ? "Explore →" : "Coming soon"}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:JBS_THEME.colors.background},
 container:{padding:JBS_THEME.spacing.lg},
 eyebrow:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2,marginTop:JBS_THEME.spacing.md},
 title:{color:JBS_THEME.colors.text,fontSize:32,fontWeight:"900",marginTop:6},
 subtitle:{color:JBS_THEME.colors.textSecondary,fontSize:14,marginTop:6,marginBottom:JBS_THEME.spacing.xl},
 grid:{gap:JBS_THEME.spacing.md},
 card:{backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.lg,padding:JBS_THEME.spacing.lg},
 disabledCard:{opacity:0.65},
 icon:{fontSize:30},
 product:{color:JBS_THEME.colors.text,fontSize:19,fontWeight:"900",marginTop:JBS_THEME.spacing.md},
 action:{color:JBS_THEME.colors.primary,fontSize:12,fontWeight:"800",marginTop:JBS_THEME.spacing.sm}
});