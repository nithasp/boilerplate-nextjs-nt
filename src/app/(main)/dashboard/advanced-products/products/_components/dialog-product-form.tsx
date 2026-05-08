"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CloseIcon from "@mui/icons-material/Close";
import {
  CATEGORIES,
  DESCRIPTION_TEMPLATES,
  RANDOM_IMAGES,
  SHOPS,
  generateProductName,
  randomElement,
  randomInt,
  randomPrice,
} from "./product-form-data";
import {
  DialogProductFormProps,
  DialogProductFormValues,
} from "../_types/dialog-product-form.types";

const DEFAULT_VALUES: DialogProductFormValues = {
  name: "",
  category: CATEGORIES[0],
  price: "",
  image: "",
  description: "",
  stock: "",
  shopId: "",
  shopName: "",
  isActive: true,
};

export default function DialogProductForm({
  open,
  mode,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}: DialogProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DialogProductFormValues>({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      reset({
        name: initialData.name ?? "",
        category: initialData.category ?? CATEGORIES[0],
        price: String(initialData.price ?? ""),
        image: initialData.image ?? "",
        description: initialData.description ?? "",
        stock: String(initialData.stock ?? ""),
        shopId: initialData.shopId ?? "",
        shopName: initialData.shopName ?? "",
        isActive: initialData.isActive ?? true,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [open, mode, initialData, reset]);

  const handleRandomGenerate = () => {
    const category = randomElement(CATEGORIES);
    const productName = generateProductName(category);
    const shop = randomElement(SHOPS);

    setValue("name", productName);
    setValue("category", category);
    setValue("price", String(randomPrice(category)));
    setValue("image", randomElement(RANDOM_IMAGES));
    setValue(
      "description",
      randomElement(DESCRIPTION_TEMPLATES)(productName, category)
    );
    setValue("stock", String(randomInt(5, 600)));
    setValue("shopId", shop.id);
    setValue("shopName", shop.name);
    setValue("isActive", Math.random() > 0.15);
  };

  const handleFormSubmit = (values: DialogProductFormValues) => {
    onSubmit({
      name: values.name,
      category: values.category,
      price: parseFloat(values.price),
      image: values.image || undefined,
      description: values.description || undefined,
      stock: values.stock ? parseInt(values.stock, 10) : undefined,
      shopId: values.shopId || undefined,
      shopName: values.shopName || undefined,
      isActive: values.isActive,
    });
  };

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === "create" ? "Create New Product" : "Edit Product"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomGenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
            >
              <AutoFixHighIcon fontSize="small" />
              Random Fill
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
              aria-label="Close dialog"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", { required: "Product name is required" })}
                placeholder="e.g. Smart Fitness Tracker Watch"
                className={inputClass}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select {...register("category")} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className={inputClass}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Stock</label>
              <input
                {...register("stock", {
                  min: { value: 0, message: "Stock must be non-negative" },
                })}
                type="number"
                placeholder="0"
                className={inputClass}
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Image URL</label>
              <input
                {...register("image")}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Product description..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Shop ID</label>
              <input
                {...register("shopId")}
                placeholder="e.g. shop_001"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Shop Name</label>
              <input
                {...register("shopName")}
                placeholder="e.g. TechZone Store"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active (visible in storefront)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {mode === "create" ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
