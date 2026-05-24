import api from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import {
  AddToCartPayload,
  CartItem,
  Product,
  UpdateCartPayload,
} from "@/types/advanced-product.types";

type Id = string | number;

export const advancedProductService = {
  getProducts: async () => {
    const { data } = await api.get<ApiResponse<Product[]>>("/products");
    return data;
  },

  getProductById: async (id: Id) => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return data;
  },

  createProduct: async (payload: Omit<Product, "id">) => {
    const { data } = await api.post<ApiResponse<Product>>("/products", payload);
    return data;
  },

  updateProduct: async (id: Id, payload: Partial<Product>) => {
    const { data } = await api.put<ApiResponse<Product>>(
      `/products/${id}`,
      payload
    );
    return data;
  },

  deleteProduct: async (id: Id) => {
    const { data } = await api.delete<ApiResponse>(`/products/${id}`);
    return data;
  },

  getCart: async () => {
    const { data } = await api.get<ApiResponse<CartItem[]>>("/cart");
    return data;
  },

  addToCart: async (payload: AddToCartPayload) => {
    const { data } = await api.post<ApiResponse<CartItem>>("/cart", payload);
    return data;
  },

  updateCartItem: async (id: Id, payload: UpdateCartPayload) => {
    const { data } = await api.put<ApiResponse<CartItem>>(
      `/cart/${id}`,
      payload
    );
    return data;
  },

  removeCartItem: async (id: Id) => {
    const { data } = await api.delete<ApiResponse>(`/cart/${id}`);
    return data;
  },

  clearCart: async () => {
    const { data } = await api.delete<ApiResponse>("/cart");
    return data;
  },
};

export default advancedProductService;
