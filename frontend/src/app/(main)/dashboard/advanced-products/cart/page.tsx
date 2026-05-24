"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import ToastNotification from "@/lib/toast";
import {
  useClearCart,
  useGetCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/shared/hooks/queries";
import Loading from "@/shared/components/loading/loading";
import type { CartItem, CartShopGroup } from "@/types/advanced-product.types";
import type { DiscountOption, PaymentOption } from "@/types/cart.types";

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: "visa",
    label: "Visa",
    badge: "VISA",
    badgeClassName: "bg-blue-700 text-white",
  },
  {
    id: "mastercard",
    label: "Mastercard",
    badge: "MC",
    badgeClassName: "bg-red-600 text-white",
  },
  {
    id: "qrcode",
    label: "QR Code",
    badge: "QR",
    badgeClassName: "bg-gray-800 text-white",
  },
  {
    id: "banktransfer",
    label: "Bank Transfer",
    badge: "BANK",
    badgeClassName: "bg-emerald-600 text-white",
  },
];

const DISCOUNT_CODES: DiscountOption[] = [
  { code: "10%OFF", rate: 0.1 },
  { code: "SAVE20", rate: 0.2 },
];

const UPDATE_DEBOUNCE_MS = 400;

const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CartPage() {
  const t = useTranslations("dashboard.advancedProducts.cart");

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const items = data?.data ?? [];

  const shopGroups = useMemo<CartShopGroup[]>(() => {
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
  }, [items]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<string>(
    PAYMENT_OPTIONS[0].id
  );
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountOption | null>(
    null
  );

  const updateTimeouts = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<number>();
      const ids = new Set(items.map((i) => i.id));
      for (const id of prev) if (ids.has(id)) next.add(id);
      for (const id of ids) if (!prev.has(id)) next.add(id);
      return next;
    });
  }, [items]);

  useEffect(() => {
    const timeouts = updateTimeouts.current;
    return () => {
      for (const timeout of timeouts.values()) clearTimeout(timeout);
      timeouts.clear();
    };
  }, []);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const selectedTotals = useMemo(() => {
    const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = selectedItems.reduce(
      (sum, i) => sum + Number(i.selectedType?.price ?? 0) * i.quantity,
      0
    );
    return { totalItems, subtotal };
  }, [selectedItems]);

  const discountAmount = appliedDiscount
    ? selectedTotals.subtotal * appliedDiscount.rate
    : 0;
  const total = Math.max(selectedTotals.subtotal - discountAmount, 0);

  const isShopFullySelected = (group: { items: CartItem[] }) =>
    group.items.length > 0 && group.items.every((i) => selectedIds.has(i.id));

  const toggleItem = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleShop = (group: { items: CartItem[] }) => {
    const fullySelected = isShopFullySelected(group);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const item of group.items) {
        if (fullySelected) next.delete(item.id);
        else next.add(item.id);
      }
      return next;
    });
  };

  const debouncedUpdate = (id: number, quantity: number) => {
    const existing = updateTimeouts.current.get(id);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      updateCartItemMutation.mutate(
        { id, payload: { quantity } },
        {
          onSuccess: () => {
            ToastNotification.success(t("notifications.updated"));
          },
          onError: () => {
            ToastNotification.error(t("notifications.updateFailed"));
          },
        }
      );
      updateTimeouts.current.delete(id);
    }, UPDATE_DEBOUNCE_MS);

    updateTimeouts.current.set(id, timeout);
  };

  const handleIncrease = (item: CartItem) => {
    const stock = item.selectedType?.stock ?? 0;
    if (stock > 0 && item.quantity >= stock) {
      ToastNotification.error(t("notifications.maxStock", { count: stock }));
      return;
    }
    debouncedUpdate(item.id, item.quantity + 1);
  };

  const handleDecrease = (item: CartItem) => {
    if (item.quantity <= 1) return;
    debouncedUpdate(item.id, item.quantity - 1);
  };

  const handleRemove = (item: CartItem) => {
    removeCartItemMutation.mutate(item.id, {
      onSuccess: () => {
        ToastNotification.success(
          t("notifications.removed", { name: item.productName })
        );
      },
      onError: () => {
        ToastNotification.error(t("notifications.removeFailed"));
      },
    });
  };

  const handleClearCart = () => {
    if (!window.confirm(t("clearConfirm"))) return;
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        setAppliedDiscount(null);
        setDiscountInput("");
        ToastNotification.info(t("notifications.cleared"));
      },
      onError: () => {
        ToastNotification.error(t("notifications.clearFailed"));
      },
    });
  };

  const handleApplyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    const match = DISCOUNT_CODES.find((d) => d.code === code);
    if (!match) {
      ToastNotification.error(t("notifications.invalidDiscount"));
      return;
    }
    setAppliedDiscount(match);
    ToastNotification.success(t("notifications.discountApplied", { code }));
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      ToastNotification.error(t("notifications.empty"));
      return;
    }
    ToastNotification.success(t("notifications.checkout"));
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading variant="spinner" size="lg" label={t("loading")} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl">
          <p className="font-semibold">{t("errors.loadFailed")}</p>
          <p className="text-sm mt-1">
            {(error as { message?: string })?.message ?? "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            {t("errors.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ShoppingCartIcon className="text-blue-600 dark:text-blue-400 w-7 h-7" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("title")}
                </h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("itemCount", {
                  count: items.reduce((sum, i) => sum + i.quantity, 0),
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={clearCartMutation.isPending}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors disabled:opacity-50"
                >
                  {t("clearCart")}
                </button>
              )}
              <Link
                href={ROUTES.advancedProducts}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <ArrowBackIcon fontSize="small" />
                <span className="hidden sm:inline">
                  {t("continueShopping")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <ShoppingCartIcon className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t("empty.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t("empty.description")}
            </p>
            <Link
              href={ROUTES.advancedProducts}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
            >
              <ArrowBackIcon />
              <span>{t("empty.startShopping")}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {isFetching && (
              <Loading
                overlay
                variant="spinner"
                size="md"
                label={t("refreshing")}
              />
            )}

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <LocationOnIcon className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {t("delivery.title")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("delivery.empty")}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    <AddIcon fontSize="small" />
                    {t("delivery.add")}
                  </button>
                </div>
              </div>

              {shopGroups.map((group) => {
                const shopChecked = isShopFullySelected(group);
                return (
                  <div
                    key={group.shopId}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-blue-50/30 dark:from-blue-900/20 dark:to-blue-900/10 border-b-2 border-blue-200 dark:border-blue-800">
                      <input
                        type="checkbox"
                        checked={shopChecked}
                        onChange={() => toggleShop(group)}
                        className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                        aria-label={t("selectShop", { shop: group.shopName })}
                      />
                      <StoreIcon className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {group.shopName}
                      </span>
                    </div>

                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {group.items.map((item) => {
                        const checked = selectedIds.has(item.id);
                        const stock = item.selectedType?.stock ?? 0;
                        const lineTotal =
                          Number(item.selectedType?.price ?? 0) * item.quantity;
                        return (
                          <li
                            key={item.id}
                            className="flex items-center gap-4 px-5 py-4"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleItem(item.id)}
                              className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                              aria-label={t("selectItem", {
                                name: item.productName,
                              })}
                            />

                            <Link
                              href={ROUTES.advancedProductDetail(
                                item.productId
                              )}
                              className="block w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                            >
                              <img
                                src={
                                  item.selectedType?.image ?? item.productImage
                                }
                                alt={item.productName}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </Link>

                            <div className="min-w-0 flex-1">
                              <Link
                                href={ROUTES.advancedProductDetail(
                                  item.productId
                                )}
                                className="block text-sm font-bold text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title={item.productName}
                              >
                                {item.productName}
                              </Link>
                              {item.selectedType?.color && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {t("color")}: {item.selectedType.color}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                                {formatPrice(
                                  Number(item.selectedType?.price ?? 0)
                                )}
                              </p>
                            </div>

                            <div className="flex items-center flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleDecrease(item)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 inline-flex items-center justify-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label={t("decreaseQuantity")}
                              >
                                <RemoveIcon fontSize="small" />
                              </button>
                              <span className="w-12 h-8 inline-flex items-center justify-center border-y border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleIncrease(item)}
                                disabled={stock > 0 && item.quantity >= stock}
                                className="w-8 h-8 inline-flex items-center justify-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label={t("increaseQuantity")}
                              >
                                <AddIcon fontSize="small" />
                              </button>
                            </div>

                            <p className="hidden sm:block text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[80px] text-right">
                              {formatPrice(lineTotal)}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
                              disabled={removeCartItemMutation.isPending}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                              aria-label={t("removeFromCart")}
                              title={t("removeFromCart")}
                            >
                              <CloseIcon fontSize="small" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 lg:sticky lg:top-6 self-start">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <LocalOfferIcon className="text-gray-700 dark:text-gray-300 w-5 h-5" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t("discount.title")}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder={t("discount.placeholder")}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {t("discount.apply")}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t("discount.available")}:
                  </span>
                  {DISCOUNT_CODES.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => {
                        setDiscountInput(d.code);
                        setAppliedDiscount(d);
                        ToastNotification.success(
                          t("notifications.discountApplied", { code: d.code })
                        );
                      }}
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full border transition-colors ${
                        appliedDiscount?.code === d.code
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      }`}
                    >
                      {d.code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCardIcon className="text-gray-700 dark:text-gray-300 w-5 h-5" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t("payment.title")}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_OPTIONS.map((option) => {
                    const active = paymentMethod === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                          active
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-flex items-center justify-center min-w-[36px] h-5 px-1 text-[10px] font-extrabold rounded ${option.badgeClassName}`}
                        >
                          {option.badge}
                        </span>
                        <span className="truncate">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                  {t("summary.title")}
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("summary.selected", {
                        count: selectedTotals.totalItems,
                      })}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(selectedTotals.subtotal)}
                    </span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("summary.discount", { code: appliedDiscount.code })}
                      </span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("summary.shipping")}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {t("summary.shippingFree")}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {t("summary.total")}
                    </span>
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <LockIcon fontSize="small" />
                  <span>
                    {t("summary.checkout", {
                      count: selectedTotals.totalItems,
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
