import type { Product } from "@/types/advanced-product.types";

export interface DialogDeleteProductProps {
  open: boolean;
  product: Product | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
