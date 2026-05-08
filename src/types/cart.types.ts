export interface PaymentOption {
  id: string;
  label: string;
  badge: string;
  badgeClassName: string;
}

export interface DiscountOption {
  code: string;
  rate: number;
}
