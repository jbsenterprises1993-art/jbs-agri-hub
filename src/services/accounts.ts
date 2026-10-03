import type { Account, AccountTransaction } from "@/data/accounts-types";

const safeAmount = (value: number) => Math.max(0, Number(value) || 0);

export function accountBalance(
  account: Account,
  transactions: AccountTransaction[],
): number {
  const openingBalance = safeAmount(account.openingBalance);
  return transactions
    .filter((item) => item.accountId === account.id)
    .reduce((balance, item) => {
      const amount = safeAmount(item.amount);
      if (item.type === "income") return balance + amount;
      if (item.type === "expense") return balance - amount;
      return balance;
    }, openingBalance);
}

export function transferBetweenAccounts(
  from: Account,
  to: Account,
  amount: number,
): { from: Account; to: Account } {
  const safeTransfer = safeAmount(amount);
  if (!safeTransfer) throw new Error("Transfer amount must be greater than zero");
  return { from, to };
}
