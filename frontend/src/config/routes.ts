/**
 * Centralised route definitions for use across the app.
 * Adding routes here keeps `next/link`, programmatic navigation, and the
 * sidebar in sync.
 */

export const ROUTES = {
  home: "/",

  // Auth
  login: "/login",
  forgotPassword: "/forgot-password",

  // Admin
  admin: "/admin",

  // Main
  dashboard: "/dashboard",
  myStats: "/dashboard/my-stats",
  backsideManagement: "/dashboard/backside-management",

  // Forms
  formsSimple: "/dashboard/forms/simple",
  formsMockup: "/dashboard/forms/mockup",

  // Playground (demo pages)
  demoButton: "/dashboard/demo/button",
  demoInput: "/dashboard/demo/input",
  demoUseMemo: "/dashboard/demo/usememo",
  demoUseCallback: "/dashboard/demo/usecallback",

  // VTMS
  sailingLog: "/dashboard/vtms/sailing-log",
  sailingLogDetail: (id: string | number) =>
    `/dashboard/vtms/sailing-log/${id}`,
  sailingLogEdit: (id: string | number) =>
    `/dashboard/vtms/sailing-log/${id}/edit`,
  anchorShip: "/dashboard/vtms/anchor-ship",
  anchorShipDetail: (id: string | number) =>
    `/dashboard/vtms/anchor-ship/${id}`,
  logBook: "/dashboard/vtms/log-book",
  logBookDetail: (id: string | number) => `/dashboard/vtms/log-book/${id}`,

  // Todo (JSONPlaceholder demo)
  todo: "/dashboard/todo",
  todoDetail: (id: string | number) => `/dashboard/todo/${id}`,

  // Advanced Products
  advancedProducts: "/dashboard/advanced-products/products",
  advancedProductDetail: (id: string | number) =>
    `/dashboard/advanced-products/products/${id}`,
  advancedProductsCart: "/dashboard/advanced-products/cart",
} as const;
