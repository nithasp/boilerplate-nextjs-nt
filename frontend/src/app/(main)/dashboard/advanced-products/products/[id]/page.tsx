"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  useAddToCart,
  useCart,
  useDeleteProduct,
  useGetProductById,
  useUpdateProduct,
} from "@/shared/hooks/queries";
import { Product, ProductType } from "@/types/advanced-product.types";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/shared/utils/functions";
import StarRating from "../_components/star-rating";
import ToastNotification from "@/lib/toast";
import DialogProductForm from "../_components/dialog-product-form";
import DialogDeleteProduct from "../_components/dialog-delete-product";
import Loading from "@/shared/components/loading/loading";

const COLOR_OVERRIDES: Record<string, string> = {
  "rose gold": "#b76e79",
};

const resolveColor = (color: string) =>
  COLOR_OVERRIDES[color.toLowerCase()] ?? color.toLowerCase();

const ColorSwatch = ({ color }: { color: string }) => (
  <span
    className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-500 inline-block"
    style={{ backgroundColor: resolveColor(color) }}
    aria-hidden
  />
);

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetProductById(id);
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const addToCartMutation = useAddToCart();

  const { items: cartItems } = useCart();
  const product = data?.data ?? null;
  const variants = product?.types ?? [];

  const selectedVariant: ProductType | null = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find((v) => v._id === selectedTypeId) ?? variants[0] ?? null
    );
  }, [variants, selectedTypeId]);

  useEffect(() => {
    if (!selectedTypeId && variants[0]?._id) {
      setSelectedTypeId(variants[0]._id);
    }
  }, [variants, selectedTypeId]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedTypeId]);

  const displayPrice = selectedVariant?.price ?? Number(product?.price ?? 0);
  const displayStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const mainImage =
    selectedImage ??
    selectedVariant?.image ??
    product?.image ??
    product?.previewImg?.[0] ??
    null;

  const inCartForVariant = useMemo(() => {
    if (!product?.id || !selectedVariant?._id) return 0;
    return cartItems
      .filter(
        (i) => i.productId === product.id && i.typeId === selectedVariant._id
      )
      .reduce((sum, i) => sum + i.quantity, 0);
  }, [cartItems, product?.id, selectedVariant?._id]);

  const remainingStock = Math.max(displayStock - inCartForVariant, 0);
  const isOutOfStock = remainingStock === 0;
  const exceedsStock = quantity > remainingStock;

  const handleQuantityChange = (next: number) => {
    if (Number.isNaN(next)) return;
    setQuantity(Math.max(1, Math.min(remainingStock || 1, next)));
  };

  const handleAddToCart = () => {
    if (!product?.id) return;
    if (!selectedVariant?._id) {
      ToastNotification.error("Please select a variant first.");
      return;
    }
    if (isOutOfStock) {
      ToastNotification.error(`${product.name} is out of stock.`);
      return;
    }
    if (exceedsStock) {
      ToastNotification.error(
        `Only ${remainingStock} more available in stock.`
      );
      return;
    }

    addToCartMutation.mutate(
      {
        productId: product.id,
        typeId: selectedVariant._id,
        quantity,
        selectedType: selectedVariant,
        shopId: product.shopId ?? "",
        shopName: product.shopName ?? "",
      },
      {
        onSuccess: () => {
          ToastNotification.success(
            `${product.name} (${selectedVariant.color}) × ${quantity} added to cart.`
          );
          setQuantity(1);
        },
        onError: () => {
          ToastNotification.error(`Failed to add ${product.name} to cart.`);
        },
      }
    );
  };

  const handleEditSubmit = (payload: Omit<Product, "id">) => {
    if (!product?.id) return;
    updateMutation.mutate(
      { id: product.id, payload },
      {
        onSuccess: () => {
          ToastNotification.success("Product updated successfully!");
          setEditOpen(false);
        },
        onError: () => {
          ToastNotification.error("Failed to update product.");
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!product?.id) return;
    deleteMutation.mutate(product.id, {
      onSuccess: () => {
        ToastNotification.success("Product deleted successfully!");
        router.push(ROUTES.advancedProducts);
      },
      onError: () => {
        ToastNotification.error("Failed to delete product.");
      },
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 min-w-0">
          <Link
            href={ROUTES.advancedProducts}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            Advanced Products
          </Link>
          <ChevronRightIcon className="flex-shrink-0 !w-4 !h-4" />
          <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
            {isLoading ? "Loading..." : (product?.name ?? `Product #${id}`)}
          </span>
        </nav>

        {product && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="p-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition-colors"
              title="Edit product"
              aria-label="Edit product"
            >
              <EditIcon fontSize="small" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="p-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
              title="Delete product"
              aria-label="Delete product"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-24">
          <Loading variant="spinner" size="lg" label="Loading product..." />
        </div>
      ) : isError ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl">
          <p className="font-semibold">Failed to load product</p>
          <p className="text-sm mt-1">
            {(error as { message?: string })?.message ?? "Unknown error"}
          </p>
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Try again
            </button>
            <Link
              href={ROUTES.advancedProducts}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50"
            >
              Back to list
            </Link>
          </div>
        </div>
      ) : !product ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          Product not found.
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <Loading
              overlay
              variant="spinner"
              size="md"
              label="Refreshing..."
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square shadow-sm">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="!w-20 !h-20" />
                  </div>
                )}
                {product.isActive === false && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-gray-800/80 text-white rounded-full">
                      Inactive
                    </span>
                  </div>
                )}
              </div>

              {product.previewImg && product.previewImg.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.previewImg.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        mainImage === img
                          ? "border-blue-500 shadow-md"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                      }`}
                      aria-label={`Preview ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                {product.category ?? "Uncategorized"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>

              {product.overallRating != null && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <StarRating rating={product.overallRating} />
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    {product.overallRating.toFixed(1)}
                  </span>
                  {product.reviews && (
                    <span className="text-gray-400">
                      ({product.reviews.length} reviews)
                    </span>
                  )}
                </div>
              )}

              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                ${displayPrice.toFixed(2)}
              </p>

              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {variants.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Color:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => {
                      const active = selectedVariant?._id === variant._id;
                      const disabled = (variant.stock ?? 0) === 0;
                      return (
                        <button
                          key={variant._id ?? variant.productId}
                          type="button"
                          onClick={() => {
                            if (variant._id) setSelectedTypeId(variant._id);
                            setSelectedImage(null);
                          }}
                          disabled={disabled}
                          className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full border-2 transition-colors ${
                            active
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-blue-400"
                          } ${disabled ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                          aria-pressed={active}
                        >
                          {!active && <ColorSwatch color={variant.color} />}
                          {variant.color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Quantity:
                </p>
                <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-9 h-9 inline-flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <RemoveIcon fontSize="small" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={remainingStock || 1}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value, 10))
                    }
                    className="w-12 h-9 text-center text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-x border-gray-300 dark:border-gray-600 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= remainingStock || isOutOfStock}
                    className="w-9 h-9 inline-flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <AddIcon fontSize="small" />
                  </button>
                </div>
              </div>

              <p
                className={`text-sm font-semibold mb-5 ${
                  isOutOfStock
                    ? "text-red-500 dark:text-red-400"
                    : remainingStock < 20
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `In Stock (${remainingStock} available)`}
                {inCartForVariant > 0 && !isOutOfStock && (
                  <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    · {inCartForVariant} already in cart
                  </span>
                )}
              </p>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  isOutOfStock ||
                  exceedsStock ||
                  addToCartMutation.isPending ||
                  !selectedVariant?._id
                }
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <ShoppingCartIcon fontSize="small" />
                <span>
                  {addToCartMutation.isPending
                    ? "Adding..."
                    : isOutOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review._id ?? review.userId}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <StarRating rating={review.star} />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {review.userName}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(review.date, "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <DialogProductForm
        open={editOpen}
        mode="edit"
        initialData={product}
        isSubmitting={updateMutation.isPending}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />
      <DialogDeleteProduct
        open={deleteOpen}
        product={product}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {(updateMutation.isPending || deleteMutation.isPending) && (
        <Loading
          fullScreen
          variant="spinner"
          size="lg"
          label={
            updateMutation.isPending
              ? "Saving changes..."
              : "Deleting product..."
          }
          className="z-[200]"
        />
      )}
    </div>
  );
}
