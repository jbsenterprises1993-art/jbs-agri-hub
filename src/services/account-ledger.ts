import type { AccountTransaction } from "@/data/accounts-types";

export function buildTransferTransactions(
  transferId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description = "Account transfer",
): AccountTransaction[] {
  const safeAmount = Math.max(0, Number(amount) || 0);
  if (!safeAmount) throw new Error("Transfer amount must be greater than zero");
  const date = new Date().toISOString();
  return [
    { id: `${transferId}-out`, accountId: fromAccountId, type: "expense", amount: safeAmount, description, date, linkedAccountId: toAccountId },
    { id: `${transferId}-in`, accountId: toAccountId, type: "income", amount: safeAmount, description, date, linkedAccountId: fromAccountId },
  ];
}
