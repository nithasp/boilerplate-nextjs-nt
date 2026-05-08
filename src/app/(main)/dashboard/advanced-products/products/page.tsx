"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  useAddToCart,
  useCart,
  useCartQuantities,
  useCreateProduct,
  useDeleteProduct,
  useGetProducts,
  useUpdateProduct,
} from "@/shared/hooks/queries";
import { getCartItemStatus } from "@/shared/selectors/cart.selectors";
import { Product } from "@/types/advanced-product.types";
import { ROUTES } from "@/config/routes";
import ToastNotification from "@/lib/toast";
import Loading from "@/shared/components/loading/loading";
import DialogDeleteProduct from "./_components/dialog-delete-product";
import DialogProductForm from "./_components/dialog-product-form";
import ProductCard from "./_components/product-card";

const PAGE_SIZE = 12;

export default function AdvancedProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetProducts();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const addToCartMutation = useAddToCart();

  const { totalItems } = useCart();
  const cartQuantities = useCartQuantities();
  const products = data?.data ?? [];

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.category)
            .filter((c): c is string => Boolean(c))
        )
      ),
    ],
    [products]
  );

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch =
        !kw ||
        p.name.toLowerCase().includes(kw) ||
        (p.description ?? "").toLowerCase().includes(kw) ||
        (p.shopName ?? "").toLowerCase().includes(kw);
      return matchCat && matchSearch;
    });
  }, [products, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setFormMode("edit");
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    if (product.id == null) {
      ToastNotification.error("Cannot add this product to cart.");
      return;
    }

    const stock = product.stock ?? 0;
    if (stock <= 0) {
      ToastNotification.error(`${product.name} is out of stock.`);
      return;
    }

    const inCart = cartQuantities[String(product.id)] ?? 0;
    if (inCart >= stock) {
      ToastNotification.error(
        `Only ${stock} of ${product.name} available in stock.`
      );
      return;
    }

    const firstType = product.types?.[0];
    if (!firstType?._id) {
      ToastNotification.error(
        `${product.name} has no available variant to add.`
      );
      return;
    }

    addToCartMutation.mutate(
      {
        productId: product.id,
        typeId: firstType._id,
        quantity: 1,
        selectedType: firstType,
        shopId: product.shopId ?? "",
        shopName: product.shopName ?? "",
      },
      {
        onSuccess: () => {
          ToastNotification.success(`${product.name} added to cart.`);
        },
        onError: () => {
          ToastNotification.error(`Failed to add ${product.name} to cart.`);
        },
      }
    );
  };

  const handleFormSubmit = (payload: Omit<Product, "id">) => {
    if (formMode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          ToastNotification.success("Product created successfully!");
          setFormOpen(false);
        },
        onError: () => {
          ToastNotification.error("Failed to create product.");
        },
      });
      return;
    }

    if (editingProduct?.id == null) return;
    updateMutation.mutate(
      { id: editingProduct.id, payload },
      {
        onSuccess: () => {
          ToastNotification.success("Product updated successfully!");
          setFormOpen(false);
        },
        onError: () => {
          ToastNotification.error("Failed to update product.");
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct?.id) return;
    deleteMutation.mutate(deletingProduct.id, {
      onSuccess: () => {
        ToastNotification.success("Product deleted successfully!");
        setDeleteOpen(false);
        setDeletingProduct(null);
      },
      onError: () => {
        ToastNotification.error("Failed to delete product.");
      },
    });
  };

  const crudLabel = createMutation.isPending
    ? "Creating product..."
    : updateMutation.isPending
      ? "Saving changes..."
      : deleteMutation.isPending
        ? "Deleting product..."
        : null;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage products via{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Storefront API
            </span>{" "}
            — TanStack Query + Axios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.advancedProductsCart}
            className="relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ShoppingCartIcon fontSize="small" />
            Cart
            {totalItems > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60 transition-colors"
          >
            {isFetching ? (
              <Loading
                variant="spinner"
                size="xs"
                inline
                label="Refreshing..."
              />
            ) : (
              "Refresh"
            )}
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <AddIcon fontSize="small" />
            New Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !w-4 !h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, description, or shop..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isLoading && !isError && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {products.length}
          </span>{" "}
          products
        </p>
      )}

      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-20">
          <Loading variant="spinner" size="lg" label="Loading products..." />
        </div>
      ) : isError ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl">
          <p className="font-semibold">Failed to fetch products</p>
          <p className="text-sm mt-1">
            {(error as { message?: string })?.message ?? "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
          <InventoryIcon className="text-gray-300 dark:text-gray-600 mx-auto mb-3 !w-12 !h-12" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No products found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="relative">
            {isFetching && (
              <Loading
                overlay
                variant="spinner"
                size="md"
                label="Refreshing..."
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paged.map((product) => {
                const { inCart, isOutOfStock, isMaxedInCart } =
                  getCartItemStatus(
                    cartQuantities,
                    product.id,
                    product.stock
                  );
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    inCart={inCart}
                    isOutOfStock={isOutOfStock}
                    isMaxedInCart={isMaxedInCart}
                    onAddToCart={handleAddToCart}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-200 px-2">
                  Page {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <DialogProductForm
        open={formOpen}
        mode={formMode}
        initialData={editingProduct}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
      <DialogDeleteProduct
        open={deleteOpen}
        product={deletingProduct}
        isDeleting={deleteMutation.isPending}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      {crudLabel && (
        <Loading
          fullScreen
          variant="spinner"
          size="lg"
          label={crudLabel}
          className="z-[200]"
        />
      )}
    </div>
  );
}
