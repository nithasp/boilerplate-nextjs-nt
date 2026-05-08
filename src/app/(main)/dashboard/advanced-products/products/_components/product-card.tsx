"use client";

import Link from "next/link";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";
import { ROUTES } from "@/config/routes";
import { Product } from "@/types/advanced-product.types";
import StarRating from "./star-rating";

const COLOR_OVERRIDES: Record<string, string> = {
  "rose gold": "#b76e79",
};

const resolveColor = (color: string) =>
  COLOR_OVERRIDES[color.toLowerCase()] ?? color.toLowerCase();

interface ProductCardProps {
  product: Product;
  inCart: number;
  isOutOfStock: boolean;
  isMaxedInCart: boolean;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({
  product,
  inCart,
  isOutOfStock,
  isMaxedInCart,
  onAddToCart,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const detailUrl = ROUTES.advancedProductDetail(product.id!);
  const stock = product.stock ?? 0;
  const addToCartLabel = isOutOfStock
    ? "Out of Stock"
    : isMaxedInCart
      ? "Max in Cart"
      : inCart > 0
        ? "Add Another"
        : "Add to Cart";

  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <Link
        href={detailUrl}
        className="block relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-700 flex-shrink-0"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="!w-12 !h-12" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isActive === false && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-gray-800/80 text-white rounded-full">
              Inactive
            </span>
          )}
          {stock < 20 && stock > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500 text-white rounded-full">
              Low Stock
            </span>
          )}
          {stock === 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        {inCart > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-emerald-600 text-white rounded-full shadow">
            In cart × {inCart}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            {product.category ?? "Uncategorized"}
          </span>
          {product.overallRating != null && (
            <div className="flex items-center gap-1">
              <StarRating rating={product.overallRating} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.overallRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <Link href={detailUrl}>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {product.shopName && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
            <StorefrontIcon className="!w-3 !h-3" />
            {product.shopName}
          </p>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {product.description ?? "—"}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${Number(product.price).toFixed(2)}
            </p>
            {product.stock != null && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {product.stock} in stock
              </p>
            )}
          </div>
          {product.types && product.types.length > 0 && (
            <div className="flex gap-1">
              {product.types.slice(0, 3).map((t) => (
                <span
                  key={t._id}
                  title={t.color}
                  className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 inline-block"
                  style={{ backgroundColor: resolveColor(t.color) }}
                />
              ))}
              {product.types.length > 3 && (
                <span className="text-xs text-gray-400 self-center">
                  +{product.types.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock || isMaxedInCart}
          className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 mb-2 text-xs font-semibold rounded-lg transition-colors ${
            isOutOfStock || isMaxedInCart
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          }`}
        >
          <AddShoppingCartIcon className="!w-3.5 !h-3.5" />
          {addToCartLabel}
        </button>

        <div className="flex gap-2 mt-auto">
          <Link
            href={detailUrl}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <VisibilityIcon className="!w-3.5 !h-3.5" />
            View
          </Link>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <EditIcon className="!w-3.5 !h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label="Delete product"
            className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <DeleteIcon className="!w-3.5 !h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
