import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { advancedProductService } from "@/services/advanced-product.service";
import {
  AddToCartPayload,
  CartItem,
  CartShopGroup,
  Product,
  UpdateCartPayload,
} from "@/types/advanced-product.types";
import { ApiResponse } from "@/types/api.types";
import type { QueryOpts } from "@/types/query.types";
import {
  buildCartQuantities,
  buildCartSummary,
  CartSummary,
  EMPTY_CART,
  groupCartByShop,
} from "@/shared/selectors/cart.selectors";
import { queryKeys } from "./query-keys";
import { isValidId } from "./query.utils";

type Id = string | number;

export const useGetProducts = (
  options?: QueryOpts<
    ApiResponse<Product[]>,
    ReturnType<typeof queryKeys.advancedProducts.list>
  >
) =>
  useQuery({
    queryKey: queryKeys.advancedProducts.list(),
    queryFn: () => advancedProductService.getProducts(),
    ...options,
  });

export const useGetProductById = (
  id: Id,
  options?: QueryOpts<
    ApiResponse<Product>,
    ReturnType<typeof queryKeys.advancedProducts.detail>
  >
) =>
  useQuery({
    queryKey: queryKeys.advancedProducts.detail(id),
    queryFn: () => advancedProductService.getProductById(id),
    enabled: isValidId(id),
    ...options,
  });

const useInvalidateProductList = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.advancedProducts.list(),
    });
};

export const useCreateProduct = () => {
  const invalidate = useInvalidateProductList();
  return useMutation({
    mutationFn: (payload: Omit<Product, "id">) =>
      advancedProductService.createProduct(payload),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: Partial<Product> }) =>
      advancedProductService.updateProduct(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.advancedProducts.list(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.advancedProducts.detail(variables.id),
      });
    },
  });
};

export const useDeleteProduct = () => {
  const invalidate = useInvalidateProductList();
  return useMutation({
    mutationFn: (id: Id) => advancedProductService.deleteProduct(id),
    onSuccess: () => invalidate(),
  });
};

const cartListQueryOptions = {
  queryKey: queryKeys.cart.list(),
  queryFn: () => advancedProductService.getCart(),
} as const;

export const useGetCart = (
  options?: QueryOpts<
    ApiResponse<CartItem[]>,
    ReturnType<typeof queryKeys.cart.list>
  >
) => useQuery({ ...cartListQueryOptions, ...options });

export const useCart = (): CartSummary => {
  const { data } = useQuery({
    ...cartListQueryOptions,
    select: (res) => buildCartSummary(res.data ?? []),
  });
  return data ?? EMPTY_CART;
};

export const useCartQuantities = (): Record<string, number> =>
  useQuery({
    ...cartListQueryOptions,
    select: (res) => buildCartQuantities(res.data ?? []),
  }).data ?? {};

export const useCartByShop = (): CartShopGroup[] =>
  useQuery({
    ...cartListQueryOptions,
    select: (res) => groupCartByShop(res.data ?? []),
  }).data ?? [];

const useInvalidateCart = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
};

export const useAddToCart = () => {
  const invalidate = useInvalidateCart();
  return useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      advancedProductService.addToCart(payload),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateCartItem = () => {
  const invalidate = useInvalidateCart();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: UpdateCartPayload }) =>
      advancedProductService.updateCartItem(id, payload),
    onSuccess: () => invalidate(),
  });
};

export const useRemoveCartItem = () => {
  const invalidate = useInvalidateCart();
  return useMutation({
    mutationFn: (id: Id) => advancedProductService.removeCartItem(id),
    onSuccess: () => invalidate(),
  });
};

export const useClearCart = () => {
  const invalidate = useInvalidateCart();
  return useMutation({
    mutationFn: () => advancedProductService.clearCart(),
    onSuccess: () => invalidate(),
  });
};
