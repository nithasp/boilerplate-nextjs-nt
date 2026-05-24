"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "@mui/icons-material";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { useCart } from "@/shared/hooks/queries";
import { ROUTES } from "@/config/routes";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/my-stats": "My Stats",
  "/dashboard/backside-management": "Backside Management",
  "/dashboard/todo": "Todo",
  "/dashboard/forms/simple": "Simple Form",
  "/dashboard/forms/mockup": "Mockup Form",
  "/dashboard/vtms/sailing-log": "Sailing Log",
  "/dashboard/vtms/anchor-ship": "Anchor Ship",
  "/dashboard/vtms/log-book": "Log Book",
  "/dashboard/advanced-products/products": "Advanced Products",
  "/dashboard/advanced-products/cart": "Cart",
  "/dashboard/demo/button": "Button Demo",
  "/dashboard/form-demo/input": "Form Demo",
  "/dashboard/demo/usememo": "useMemo Demo",
  "/dashboard/demo/usecallback": "useCallback Demo",
};

const resolvePageTitle = (pathname: string): string => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const parent = "/" + segments.slice(0, -1).join("/");
    if (PAGE_TITLES[parent]) return PAGE_TITLES[parent];
  }

  return "Dashboard";
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const pageTitle = resolvePageTitle(pathname);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
        {pageTitle}
      </h2>

      <div className="flex items-center gap-2">
        <Tooltip title="Cart" arrow>
          <Link href={ROUTES.advancedProductsCart} aria-label="Go to cart">
            <IconButton
              size="medium"
              sx={{
                color: "#ffffff",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Badge
                badgeContent={totalItems}
                color="error"
                max={99}
                invisible={totalItems === 0}
              >
                <ShoppingCart fontSize="small" />
              </Badge>
            </IconButton>
          </Link>
        </Tooltip>
      </div>
    </header>
  );
};

export default Navbar;
