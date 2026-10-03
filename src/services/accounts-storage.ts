import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Account, AccountTransaction } from "@/data/accounts-types";

export const ACCOUNTS_KEY = "jbs_accounts";
export const ACCOUNT_TRANSACTIONS_KEY = "jbs_account_transactions";

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "main", name: "Main Account", type: "main", openingBalance: 0, active: true },
  { id: "profit", name: "Profit Account", type: "profit", openingBalance: 0, active: true },
  { id: "salary", name: "Salary Account", type: "salary", openingBalance: 0, active: true },
];

export async function getAccounts(): Promise<Account[]> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Account[]) : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export async function saveAccounts(accounts: Account[]): Promise<void> {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function getAccountTransactions(): Promise<AccountTransaction[]> {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNT_TRANSACTIONS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AccountTransaction[]) : [];
  } catch {
    return [];
  }
}

export async function saveAccountTransaction(transaction: AccountTransaction): Promise<void> {
  const existing = await getAccountTransactions();
  await AsyncStorage.setItem(
    ACCOUNT_TRANSACTIONS_KEY,
    JSON.stringify([transaction, ...existing].slice(0, 500)),
  );
}
