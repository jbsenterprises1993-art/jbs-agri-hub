import AsyncStorage from "@react-native-async-storage/async-storage";

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutDraft = {
  items: CheckoutItem[];
  total: number;
};

export const CHECKOUT_DRAFT_KEY = "jbs_checkout_draft";

export async function saveCheckoutDraft(
  draft: CheckoutDraft,
): Promise<void> {
  await AsyncStorage.setItem(
    CHECKOUT_DRAFT_KEY,
    JSON.stringify(draft),
  );
}

export async function getCheckoutDraft(): Promise<CheckoutDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const draft = parsed as Partial<CheckoutDraft>;
    if (!Array.isArray(draft.items) || typeof draft.total !== "number") {
      return null;
    }

    return {
      items: draft.items.filter(
        (item): item is CheckoutItem =>
          !!item &&
          typeof item === "object" &&
          typeof (item as CheckoutItem).id === "string" &&
          typeof (item as CheckoutItem).name === "string" &&
          typeof (item as CheckoutItem).price === "number" &&
          typeof (item as CheckoutItem).quantity === "number",
      ),
      total: draft.total,
    };
  } catch (error) {
    console.log("Checkout draft error:", error);
    return null;
  }
}

export async function clearCheckoutDraft(): Promise<void> {
  await AsyncStorage.removeItem(CHECKOUT_DRAFT_KEY);
}
