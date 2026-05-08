import type { CartItem, CartShopGroup } from "@/types/advanced-product.types";
import type { CartItemStatus } from "@/types/product.types";

type Id = string | number;

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const EMPTY_CART: CartSummary = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

export const calculateCartTotals = (
  items: CartItem[]
): Pick<CartSummary, "totalItems" | "totalPrice"> => {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + Number(i.selectedType?.price ?? 0) * i.quantity,
    0
  );
  return { totalItems, totalPrice };
};

export const buildCartSummary = (items: CartItem[]): CartSummary => ({
  items,
  ...calculateCartTotals(items),
});

export const buildCartQuantities = (
  items: CartItem[]
): Record<string, number> =>
  items.reduce<Record<string, number>>((acc, item) => {
    const key = String(item.productId);
    acc[key] = (acc[key] ?? 0) + item.quantity;
    return acc;
  }, {});

export const groupCartByShop = (items: CartItem[]): CartShopGroup[] => {
  const map = new Map<string, CartShopGroup>();
  for (const item of items) {
    const group = map.get(item.shopId);
    if (group) {
      group.items.push(item);
    } else {
      map.set(item.shopId, {
        shopId: item.shopId,
        shopName: item.shopName,
        items: [item],
      });
    }
  }
  return Array.from(map.values());
};

export const getCartItemStatus = (
  quantities: Record<string, number>,
  id: Id | null | undefined,
  stock: number | null | undefined
): CartItemStatus => {
  const key = id != null ? String(id) : "";
  const inCart = key ? quantities[key] ?? 0 : 0;
  const stockNum = stock ?? 0;
  const isOutOfStock = stockNum === 0;
  const isMaxedInCart = !isOutOfStock && inCart >= stockNum;
  return { inCart, isOutOfStock, isMaxedInCart };
};
