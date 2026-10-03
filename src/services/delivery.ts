import type { Delivery, DeliveryStatus } from "@/data/delivery-types";

export function updateDeliveryStatus(
  delivery: Delivery,
  status: DeliveryStatus,
): Delivery {
  return {
    ...delivery,
    deliveryStatus: status,
    deliveredAt: status === "delivered" ? new Date().toISOString() : delivery.deliveredAt,
  };
}