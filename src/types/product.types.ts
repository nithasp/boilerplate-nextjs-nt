export interface SimpleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

export interface CartItemStatus {
  inCart: number;
  isOutOfStock: boolean;
  isMaxedInCart: boolean;
}
