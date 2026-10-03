import type { PaymentStatus } from "@/data/order-types";

export type PaymentVerification = {
  verifiedByServer: boolean;
  providerReference?: string;
};

export function resolvePaymentStatus(
  requested: PaymentStatus,
  verification?: PaymentVerification,
): PaymentStatus {
  if (requested === "cod") return "cod";
  if (requested === "paid" && verification?.verifiedByServer && verification.providerReference?.trim()) {
    return "paid";
  }
  return "pending";
}

export function canClientMarkPaid(): false {
  return false;
}
