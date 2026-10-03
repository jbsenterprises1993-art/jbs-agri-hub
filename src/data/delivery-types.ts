export type DeliveryStatus = "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";

export type Delivery = {
  id: string;
  orderId: string;
  transportName: string;
  trackingNumber?: string;
  deliveryStatus: DeliveryStatus;
  deliveryCharge: number;
  assignedAt?: string;
  deliveredAt?: string;
};