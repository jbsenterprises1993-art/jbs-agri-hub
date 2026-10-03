import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { AiTask, AiTaskStatus } from "@/data/ai-types";
import { canTransitionAiTask, updateAiTaskStatus } from "@/services/ai-tasks";
import { canQueueAiTask } from "@/services/ai-permissions";
import { getAiTasks, saveAiTask } from "@/services/ai-task-storage";
import { JBS_THEME } from "@/theme/jbs-theme";

const nextStatus: Partial<Record<AiTaskStatus, AiTaskStatus>> = { queued:"running", running:"completed", failed:"queued" };

export default function AiAssistantScreen() {
  const [tasks,setTasks]=useState<AiTask[]>([]);
  const [instruction,setInstruction]=useState("");
  const load=useCallback(async()=>setTasks(await getAiTasks()),[]);
  useFocusEffect(useCallback(()=>{load();},[load]));

  const addTask=async()=>{if(!canQueueAiTask(["read","draft"])||!instruction.trim())return; await saveAiTask({id:`ai-${Date.now()}`,appId:"owner",instruction:instruction.trim(),status:"queued",createdAt:new Date().toISOString()});setInstruction("");await load();};
  const advance=async(task:AiTask)=>{const target=nextStatus[task.status];if(!target||!canTransitionAiTask(task.status,target))return;await saveAiTask(updateAiTaskStatus(task,target));await load();};

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container}>
    <Pressable onPress={()=>router.back()} style={styles.backButton} accessibilityRole="button"><Text style={styles.back}>← Back</Text></Pressable>
    <Text style={styles.eyebrow}>JBS AI</Text><Text style={styles.title}>AI Assistant Control</Text>
    <Text style={styles.note}>Create and advance local AI tasks. No model or financial/write action is executed automatically; permissions stay explicit.</Text>
    <View style={styles.card}><Text style={styles.section}>New AI Task</Text>
      <TextInput value={instruction} onChangeText={setInstruction} placeholder="Example: Draft a WhatsApp product offer" placeholderTextColor={JBS_THEME.colors.textMuted} multiline style={styles.input}/>
      <Pressable onPress={addTask} style={styles.primaryButton} accessibilityRole="button"><Text style={styles.primaryText}>Queue AI Task</Text></Pressable>
    </View>
    <View style={styles.card}><Text style={styles.section}>Task Queue</Text>
      {tasks.length===0?<Text style={styles.muted}>No AI tasks queued.</Text>:tasks.slice(0,12).map(task=><View key={task.id} style={styles.task}>
        <View style={styles.taskMain}><Text style={styles.taskText}>{task.instruction}</Text><Text style={styles.muted}>{task.status}</Text></View>
        {nextStatus[task.status]?<Pressable onPress={()=>advance(task)} style={styles.advance} accessibilityRole="button"><Text style={styles.advanceText}>→</Text></Pressable>:null}
      </View>)}
    </View>
  </ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({
safe:{flex:1,backgroundColor:JBS_THEME.colors.background},container:{padding:JBS_THEME.spacing.lg,paddingBottom:40},
backButton:{alignSelf:"flex-start",paddingVertical:JBS_THEME.spacing.sm,paddingHorizontal:JBS_THEME.spacing.md,borderRadius:JBS_THEME.radius.md,backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,marginBottom:JBS_THEME.spacing.lg},back:{color:JBS_THEME.colors.primarySoft,fontSize:15,fontWeight:"800"},
eyebrow:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2},title:{color:JBS_THEME.colors.text,fontSize:28,fontWeight:"900",marginTop:4},note:{color:JBS_THEME.colors.textSecondary,fontSize:12,lineHeight:18,marginVertical:JBS_THEME.spacing.lg},
card:{backgroundColor:JBS_THEME.colors.surface,borderRadius:JBS_THEME.radius.lg,borderWidth:1,borderColor:JBS_THEME.colors.border,padding:JBS_THEME.spacing.lg,marginBottom:JBS_THEME.spacing.md},section:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900",marginBottom:JBS_THEME.spacing.md},
input:{backgroundColor:JBS_THEME.colors.background,borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,color:JBS_THEME.colors.text,padding:13,minHeight:90,textAlignVertical:"top",marginBottom:10},primaryButton:{backgroundColor:JBS_THEME.colors.primary,borderRadius:JBS_THEME.radius.md,padding:14,alignItems:"center"},primaryText:{color:JBS_THEME.colors.background,fontWeight:"900"},
muted:{color:JBS_THEME.colors.textMuted,fontSize:11},task:{flexDirection:"row",alignItems:"center",borderTopWidth:1,borderTopColor:JBS_THEME.colors.border,paddingVertical:12},taskMain:{flex:1,marginRight:12},taskText:{color:JBS_THEME.colors.textSecondary,fontWeight:"700",lineHeight:18},advance:{width:38,height:38,borderRadius:19,backgroundColor:JBS_THEME.colors.surfaceElevated,borderWidth:1,borderColor:JBS_THEME.colors.primary,alignItems:"center",justifyContent:"center"},advanceText:{color:JBS_THEME.colors.primary,fontSize:20,fontWeight:"900"}
});