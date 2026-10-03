import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { MarketingChannel, MarketingPost } from "@/data/marketing-types";
import { canPublishPost } from "@/services/marketing";
import { getMarketingPosts, saveMarketingPost } from "@/services/marketing-storage";
import { JBS_THEME } from "@/theme/jbs-theme";

const channels: MarketingChannel[] = ["whatsapp", "facebook", "instagram", "youtube"];

export default function MarketingScreen() {
  const [posts, setPosts] = useState<MarketingPost[]>([]);
  const [title, setTitle] = useState("JBS Agri Hub Offer");
  const [caption, setCaption] = useState("Quality agricultural equipment at JBS Agri Hub.");
  const [selected, setSelected] = useState<MarketingChannel[]>(["whatsapp", "facebook"]);

  const load = useCallback(async () => setPosts(await getMarketingPosts()), []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const createDraft = async () => {
    if (!title.trim() || !caption.trim() || selected.length === 0) return;
    await saveMarketingPost({ id:`post-${Date.now()}`, title:title.trim(), caption:caption.trim(), channels:selected, status:"draft" });
    setTitle(""); setCaption(""); await load();
  };

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
    <Pressable onPress={()=>router.back()} style={styles.backButton} accessibilityRole="button"><Text style={styles.back}>← Back</Text></Pressable>
    <Text style={styles.eyebrow}>JBS MARKETING</Text><Text style={styles.title}>Marketing Control</Text>
    <Text style={styles.note}>Create and save campaign drafts locally. Publishing remains gated until the relevant provider account/API is connected.</Text>
    <View style={styles.card}><Text style={styles.section}>Create Campaign Draft</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Campaign title" placeholderTextColor={JBS_THEME.colors.textMuted} style={styles.input}/>
      <TextInput value={caption} onChangeText={setCaption} placeholder="Caption" placeholderTextColor={JBS_THEME.colors.textMuted} multiline style={[styles.input,styles.captionInput]}/>
      <Text style={styles.label}>Channels</Text><View style={styles.channelRow}>{channels.map(ch=><Pressable key={ch} onPress={()=>setSelected(v=>v.includes(ch)?v.filter(x=>x!==ch):[...v,ch])} style={[styles.channel,selected.includes(ch)&&styles.channelActive]} accessibilityRole="button"><Text style={selected.includes(ch)?styles.channelTextActive:styles.channelText}>{ch}</Text></Pressable>)}</View>
      <Pressable onPress={createDraft} style={styles.primaryButton} accessibilityRole="button"><Text style={styles.primaryText}>Save Draft</Text></Pressable>
    </View>
    <View style={styles.card}><Text style={styles.section}>Saved Campaigns</Text>
      {posts.length===0?<Text style={styles.muted}>No campaign drafts yet.</Text>:posts.slice(0,10).map(post=><View key={post.id} style={styles.post}>
        <View style={styles.postMain}><Text style={styles.postTitle}>{post.title}</Text><Text style={styles.muted}>{post.channels.join(" • ")}</Text></View>
        <Text style={canPublishPost(post)?styles.ready:styles.muted}>{post.status}</Text>
      </View>)}
    </View>
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
safe:{flex:1,backgroundColor:JBS_THEME.colors.background},container:{padding:JBS_THEME.spacing.lg,paddingBottom:40},
backButton:{alignSelf:"flex-start",paddingVertical:JBS_THEME.spacing.sm,paddingHorizontal:JBS_THEME.spacing.md,borderRadius:JBS_THEME.radius.md,backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,marginBottom:JBS_THEME.spacing.lg},back:{color:JBS_THEME.colors.primarySoft,fontSize:15,fontWeight:"800"},
eyebrow:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:JBS_THEME.colors.text,fontSize:28,fontWeight:"900",marginTop:4},note:{color:JBS_THEME.colors.textSecondary,fontSize:12,lineHeight:18,marginVertical:JBS_THEME.spacing.lg},
card:{backgroundColor:JBS_THEME.colors.surface,borderRadius:JBS_THEME.radius.lg,borderWidth:1,borderColor:JBS_THEME.colors.border,padding:JBS_THEME.spacing.lg,marginBottom:JBS_THEME.spacing.md},section:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900",marginBottom:JBS_THEME.spacing.md},
input:{backgroundColor:JBS_THEME.colors.background,borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,color:JBS_THEME.colors.text,padding:13,marginBottom:10},captionInput:{minHeight:90,textAlignVertical:"top"},label:{color:JBS_THEME.colors.textMuted,fontSize:11,fontWeight:"800",marginBottom:8},
channelRow:{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:14},channel:{borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,paddingHorizontal:12,paddingVertical:9},channelActive:{backgroundColor:JBS_THEME.colors.surfaceElevated,borderColor:JBS_THEME.colors.primary},channelText:{color:JBS_THEME.colors.textMuted,fontWeight:"800"},channelTextActive:{color:JBS_THEME.colors.primarySoft,fontWeight:"900"},
primaryButton:{backgroundColor:JBS_THEME.colors.primary,borderRadius:JBS_THEME.radius.md,padding:14,alignItems:"center"},primaryText:{color:JBS_THEME.colors.background,fontWeight:"900"},muted:{color:JBS_THEME.colors.textMuted,fontSize:11},ready:{color:JBS_THEME.colors.primarySoft,fontWeight:"900",fontSize:11},
post:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:12,borderTopWidth:1,borderTopColor:JBS_THEME.colors.border},postMain:{flex:1,marginRight:12},postTitle:{color:JBS_THEME.colors.text,fontWeight:"800"}
});