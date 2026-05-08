import type { Product } from "@/types/advanced-product.types";

export interface DialogProductFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Product | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">) => void;
}

export type DialogProductFormValues = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  stock: string;
  shopId: string;
  shopName: string;
  isActive: boolean;
};
