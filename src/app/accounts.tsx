import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Account, AccountTransactionType } from "@/data/accounts-types";
import { accountBalance } from "@/services/accounts";
import { DEFAULT_ACCOUNTS, getAccountTransactions, getAccounts, saveAccountTransaction } from "@/services/accounts-storage";
import { JBS_THEME } from "@/theme/jbs-theme";

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [transactions, setTransactions] = useState<Awaited<ReturnType<typeof getAccountTransactions>>>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<AccountTransactionType>("income");

  const load = useCallback(async () => {
    const [nextAccounts, nextTransactions] = await Promise.all([getAccounts(), getAccountTransactions()]);
    setAccounts(nextAccounts);
    setTransactions(nextTransactions);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const addTransaction = async () => {
    const numericAmount = Math.max(0, Number(amount));
    if (!numericAmount) return;
    await saveAccountTransaction({
      id: `txn-${Date.now()}`,
      accountId: "main",
      type,
      amount: numericAmount,
      description: description.trim() || (type === "income" ? "Income" : "Expense"),
      date: new Date().toISOString(),
    });
    setAmount("");
    setDescription("");
    await load();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.eyebrow}>JBS ACCOUNTS</Text>
        <Text style={styles.title}>Accounts Control</Text>
        <Text style={styles.note}>Local income/expense entries are now persisted on this device. Bank integration and automated transfers remain release work.</Text>

        {accounts.map((account) => (
          <View key={account.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{account.name}</Text>
              <Text style={styles.badge}>{account.type.toUpperCase()}</Text>
            </View>
            <Text style={styles.balance}>₹{accountBalance(account, transactions).toLocaleString("en-IN")}</Text>
            <Text style={styles.caption}>{account.active ? "Active account • local ledger" : "Inactive account"}</Text>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.section}>Add Main Account Entry</Text>
          <View style={styles.typeRow}>
            <TypeButton label="Income" active={type === "income"} onPress={() => setType("income")} />
            <TypeButton label="Expense" active={type === "expense"} onPress={() => setType("expense")} />
          </View>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="Amount ₹" placeholderTextColor={JBS_THEME.colors.textMuted} style={styles.input} />
          <TextInput value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor={JBS_THEME.colors.textMuted} style={styles.input} />
          <Pressable onPress={addTransaction} style={styles.primaryButton} accessibilityRole="button">
            <Text style={styles.primaryText}>Save Entry</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Recent Entries</Text>
          {transactions.length === 0 ? <Text style={styles.caption}>No entries yet.</Text> : transactions.slice(0, 8).map((item) => (
            <View key={item.id} style={styles.entry}>
              <View style={styles.entryMain}>
                <Text style={styles.entryTitle}>{item.description}</Text>
                <Text style={styles.caption}>{new Date(item.date).toLocaleDateString("en-IN")}</Text>
              </View>
              <Text style={item.type === "income" ? styles.income : styles.expense}>
                {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TypeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.typeButton, active && styles.typeButtonActive]} accessibilityRole="button"><Text style={active ? styles.typeTextActive : styles.typeText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:JBS_THEME.colors.background}, container:{padding:JBS_THEME.spacing.lg,paddingBottom:40},
  backButton:{alignSelf:"flex-start",paddingVertical:JBS_THEME.spacing.sm,paddingHorizontal:JBS_THEME.spacing.md,borderRadius:JBS_THEME.radius.md,backgroundColor:JBS_THEME.colors.surface,borderWidth:1,borderColor:JBS_THEME.colors.border,marginBottom:JBS_THEME.spacing.lg},
  back:{color:JBS_THEME.colors.primarySoft,fontSize:15,fontWeight:"800"}, eyebrow:{color:JBS_THEME.colors.primarySoft,fontSize:11,fontWeight:"900",letterSpacing:2}, title:{color:JBS_THEME.colors.text,fontSize:28,fontWeight:"900",marginTop:4},
  note:{color:JBS_THEME.colors.textSecondary,fontSize:12,lineHeight:18,marginVertical:JBS_THEME.spacing.lg}, card:{backgroundColor:JBS_THEME.colors.surface,borderRadius:JBS_THEME.radius.lg,borderWidth:1,borderColor:JBS_THEME.colors.border,padding:JBS_THEME.spacing.lg,marginBottom:JBS_THEME.spacing.md},
  row:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}, name:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900"}, badge:{color:JBS_THEME.colors.primarySoft,fontSize:10,fontWeight:"900",backgroundColor:JBS_THEME.colors.surfaceElevated,paddingHorizontal:8,paddingVertical:5,borderRadius:JBS_THEME.radius.sm},
  balance:{color:JBS_THEME.colors.primary,fontSize:25,fontWeight:"900",marginTop:JBS_THEME.spacing.md}, caption:{color:JBS_THEME.colors.textMuted,fontSize:11,marginTop:4}, section:{color:JBS_THEME.colors.text,fontSize:16,fontWeight:"900",marginBottom:JBS_THEME.spacing.md},
  typeRow:{flexDirection:"row",gap:8,marginBottom:10}, typeButton:{flex:1,borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,padding:12,alignItems:"center"}, typeButtonActive:{backgroundColor:JBS_THEME.colors.surfaceElevated,borderColor:JBS_THEME.colors.primary},
  typeText:{color:JBS_THEME.colors.textMuted,fontWeight:"800"}, typeTextActive:{color:JBS_THEME.colors.primarySoft,fontWeight:"900"}, input:{backgroundColor:JBS_THEME.colors.background,borderWidth:1,borderColor:JBS_THEME.colors.border,borderRadius:JBS_THEME.radius.md,color:JBS_THEME.colors.text,padding:13,marginBottom:10},
  primaryButton:{backgroundColor:JBS_THEME.colors.primary,borderRadius:JBS_THEME.radius.md,padding:14,alignItems:"center"}, primaryText:{color:JBS_THEME.colors.background,fontWeight:"900"}, entry:{flexDirection:"row",justifyContent:"space-between",paddingVertical:10,borderTopWidth:1,borderTopColor:JBS_THEME.colors.border},entryMain:{flex:1},entryTitle:{color:JBS_THEME.colors.text,fontWeight:"800"},income:{color:JBS_THEME.colors.primarySoft,fontWeight:"900"},expense:{color:JBS_THEME.colors.danger,fontWeight:"900"}
});