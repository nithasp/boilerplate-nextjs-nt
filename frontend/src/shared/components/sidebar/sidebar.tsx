"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  FolderOpen as ProjectsIcon,
  AssignmentTurnedIn as TasksIcon,
  Description as DocumentsIcon,
  Lightbulb as DemoIcon,
  FlashOn as UseMemoIcon,
  TouchApp as ButtonDemoIcon,
  EditNote as FormDemoIcon,
  DirectionsBoat as VtmsIcon,
  ListAlt as SailingLogIcon,
  Anchor as AnchorIcon,
  MenuBook as LogBookIcon,
  Inventory2 as ProductsIcon,
  ShoppingCart as CartIcon,
  Settings as SettingsIcon,
  Storefront as AdvancedProductsIcon,
  ChevronLeft as ToggleIcon,
  KeyboardArrowDown as ChevronDownIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "@/shared/hooks/use-auth";
import { ROUTES } from "@/config/routes";
import Button from "../form/button";
import LocaleSwitcher from "../locale-switcher/locale-switcher";
import { NavItem } from "@/types/ui/sidebar.types";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const tNav = useTranslations("nav");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    { label: tNav("home"), href: ROUTES.home, icon: <HomeIcon /> },
    {
      label: tNav("dashboard"),
      href: ROUTES.dashboard,
      icon: <DashboardIcon />,
    },
    { label: tNav("projects"), href: "/projects", icon: <ProjectsIcon /> },
    { label: tNav("tasks"), href: "/tasks", icon: <TasksIcon /> },
    {
      label: tNav("documents"),
      href: "/documents",
      icon: <DocumentsIcon />,
    },
    {
      label: tNav("demo"),
      icon: <DemoIcon />,
      children: [
        {
          label: tNav("useMemoDemo"),
          href: ROUTES.demoUseMemo,
          icon: <UseMemoIcon fontSize="small" />,
        },
        {
          label: tNav("buttonDemo"),
          href: ROUTES.demoButton,
          icon: <ButtonDemoIcon fontSize="small" />,
        },
        {
          label: tNav("formDemo"),
          href: ROUTES.demoInput,
          icon: <FormDemoIcon fontSize="small" />,
        },
      ],
    },
    {
      label: tNav("vtms"),
      icon: <VtmsIcon />,
      children: [
        {
          label: tNav("sailingLog"),
          href: ROUTES.sailingLog,
          icon: <SailingLogIcon fontSize="small" />,
        },
        {
          label: tNav("anchorShip"),
          href: ROUTES.anchorShip,
          icon: <AnchorIcon fontSize="small" />,
        },
        {
          label: tNav("logBook"),
          href: ROUTES.logBook,
          icon: <LogBookIcon fontSize="small" />,
        },
      ],
    },
    {
      label: tNav("advancedProducts"),
      icon: <AdvancedProductsIcon />,
      children: [
        {
          label: tNav("products"),
          href: ROUTES.advancedProducts,
          icon: <ProductsIcon fontSize="small" />,
        },
        {
          label: tNav("cart"),
          href: ROUTES.advancedProductsCart,
          icon: <CartIcon fontSize="small" />,
        },
      ],
    },
    { label: tNav("settings"), href: "/settings", icon: <SettingsIcon /> },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = item.href ? pathname === item.href : false;
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = !!item.children?.length;
    const isChildActive =
      hasChildren && item.children?.some((c) => c.href === pathname);

    if (hasChildren) {
      return (
        <li key={item.label}>
          <button
            onClick={() => toggleExpanded(item.label)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
              isChildActive
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!isCollapsed && (
              <>
                <span className="font-medium flex-1 text-left">
                  {item.label}
                </span>
                <ChevronDownIcon
                  fontSize="small"
                  className={`transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>
          {!isCollapsed && isExpanded && (
            <ul className="mt-2 ml-3 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
              {item.children?.map((child) => {
                const isItemActive = pathname === child.href;
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href || "#"}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                        isItemActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {child.icon}
                      <span className="font-medium">{child.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.href || item.label}>
        <Link
          href={item.href || "#"}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? item.label : undefined}
        >
          {item.icon}
          {!isCollapsed && <span className="font-medium">{item.label}</span>}
        </Link>
      </li>
    );
  };

  const userInitial =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "U";

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                PMIS
              </h1>
            )}
            <button
              onClick={() => setIsCollapsed((c) => !c)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              aria-label={tNav("toggleSidebar")}
            >
              <ToggleIcon
                className={`transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">{navItems.map(renderNavItem)}</ul>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {!isCollapsed ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : tNav("user")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.username}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <LocaleSwitcher />
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={logout}
                  className="w-full"
                >
                  {tNav("logout")}
                </Button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
                title={tNav("logout")}
              >
                <LogoutIcon className="mx-auto" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${
          isCollapsed ? "hidden" : ""
        }`}
        onClick={() => setIsCollapsed(true)}
      />
    </>
  );
};

export default Sidebar;
