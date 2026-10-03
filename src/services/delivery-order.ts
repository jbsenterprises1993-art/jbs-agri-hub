import type { Order, OrderStatus } from "@/data/order-types";
import type { DeliveryStatus } from "@/data/delivery-types";

export function deliveryToOrderStatus(status: DeliveryStatus): OrderStatus | null {
  if (status === "assigned" || status === "picked_up") return "Order Processing";
  if (status === "in_transit") return "Shipped";
  if (status === "delivered") return "Delivered";
  return null;
}

export function applyDeliveryStatusToOrder(order: Order, deliveryStatus: DeliveryStatus): Order {
  const mapped = deliveryToOrderStatus(deliveryStatus);
  return mapped ? { ...order, status: mapped } : order;
}
