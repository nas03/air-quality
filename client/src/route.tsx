import { AdminPage, AppPage, SigninPage, SignupPage } from "@/pages";

import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";

export const rootRoute = createRootRoute();

const publicRoute = createRoute({
  id: "public",
  getParentRoute: () => rootRoute,
});

const protectedRoute = createRoute({
  id: "protected",
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      throw redirect({
        to: "/signin",
      });
    }
  },
});
/* PRIVATE ROUTE */
const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/admin",
  component: AdminPage,
});
/* PUBLIC ROUTE */
const signInRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/signin",
  component: SigninPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/signup",
  component: SignupPage,
});

const homeRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/",
  component: AppPage,
});

/* ROUTE TREE */
const protectedRouteTree = protectedRoute.addChildren([adminRoute]);
const publicRouteTree = publicRoute.addChildren([signInRoute, homeRoute, signUpRoute]);

const routeTree = rootRoute.addChildren([protectedRouteTree, publicRouteTree]);

const router = createRouter({ routeTree });

export default router;
