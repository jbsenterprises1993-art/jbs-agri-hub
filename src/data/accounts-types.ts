export type AccountType = "main" | "profit" | "salary" | "other";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  openingBalance: number;
  active: boolean;
};

export type AccountTransactionType = "income" | "expense" | "transfer";

export type AccountTransaction = {
  id: string;
  accountId: string;
  type: AccountTransactionType;
  amount: number;
  description: string;
  date: string;
  linkedAccountId?: string;
};