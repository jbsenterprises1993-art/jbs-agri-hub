export type Customer = {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  createdAt: string;
  active: boolean;
};

export type CustomerLoyalty = {
  customerId: string;
  coinBalance: number;
  lifetimeCoins: number;
  updatedAt: string;
};