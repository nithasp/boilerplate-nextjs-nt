import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

let routerInstance: AppRouterInstance | null = null;

export const setNavigationRouter = (router: AppRouterInstance) => {
  routerInstance = router;
};

export const navigateTo = (path: string) => {
  if (routerInstance) {
    routerInstance.push(path);
  } else {
    window.location.href = path;
  }
};

export const navigateReplace = (path: string) => {
  if (routerInstance) {
    routerInstance.replace(path);
  } else {
    window.location.replace(path);
  }
};
