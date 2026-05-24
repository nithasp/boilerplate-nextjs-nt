export interface ProductType {
  _id?: string;
  productId: number;
  color: string;
  quantity: number;
  price: number;
  stock: number;
  image: string;
}

export interface Review {
  _id?: string;
  star: number;
  comment: string;
  userId: string;
  userName: string;
  date: string;
}

export interface Product {
  id?: number;
  name: string;
  category?: string;
  price: number;
  image?: string;
  description?: string;
  previewImg?: string[];
  types?: ProductType[];
  reviews?: Review[];
  overallRating?: number;
  stock?: number;
  isActive?: boolean;
  shopId?: string;
  shopName?: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  typeId: string;
  selectedType: ProductType;
  shopId: string;
  shopName: string;
  createdAt: string;
  updatedAt: string;
  productName: string;
  productPrice: string;
  productCategory: string;
  productImage: string;
  productDescription: string;
  productPreviewImg: string[];
  productTypes: ProductType[];
  productReviews: Review[];
  productOverallRating: string;
  productStock: number;
  productIsActive: boolean;
  productShopId: string;
  productShopName: string;
}

export interface AddToCartPayload {
  productId: number;
  typeId: string;
  quantity: number;
  selectedType: ProductType;
  shopId: string;
  shopName: string;
}

export interface UpdateCartPayload {
  quantity: number;
}

export interface CartShopGroup {
  shopId: string;
  shopName: string;
  items: CartItem[];
}
