import type { Account, AccountTransaction } from "@/data/accounts-types";

export function accountBalance(
  account: Account,
  transactions: AccountTransaction[],
): number {
  return transactions
    .filter((item) => item.accountId === account.id)
    .reduce((balance, item) => {
      if (item.type === "income") return balance + item.amount;
      if (item.type === "expense") return balance - item.amount;
      return balance;
    }, account.openingBalance);
}

export function transferBetweenAccounts(
  from: Account,
  to: Account,
  amount: number,
): { from: Account; to: Account } {
  if (amount <= 0) throw new Error("Transfer amount must be greater than zero");
  return { from, to };
}