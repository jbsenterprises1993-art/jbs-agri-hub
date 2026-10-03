export type OrderStatus =
  | "Order Confirmed"
  | "Order Processing"
  | "Shipped"
  | "Delivered";

export type PaymentMethod =
  | "Cash on Delivery"
  | "UPI Payment";

export type PaymentStatus =
  | "pending"
  | "cod"
  | "paid";

export type Order = {
  orderId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: PaymentStatus;
  deliveryType: string;
  customerName?: string;
  mobile?: string;
  address?: string;
  date: string;
  status: OrderStatus;
};