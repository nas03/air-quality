import { AdminPage, AnalyticsDashboard, AppPage, SigninPage, SignupPage } from "@/pages";

import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import CodeVerificationPage from "./pages/CodeVerificationPage/CodeVerificationPage";
import LandingPage from "./pages/LandingPage/LandingPage";

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

const analyticsRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/analytics",
  component: AnalyticsDashboard,
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

const landingRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/home",
  component: LandingPage,
});

const emailVerificationRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "/email-verification",
  component: CodeVerificationPage,
});

/* ROUTE TREE */
const protectedRouteTree = protectedRoute.addChildren([adminRoute]);
const publicRouteTree = publicRoute.addChildren([
  signInRoute,
  homeRoute,
  signUpRoute,
  analyticsRoute,
  landingRoute,
  emailVerificationRoute,
]);

const routeTree = rootRoute.addChildren([protectedRouteTree, publicRouteTree]);

const router = createRouter({ routeTree });

export default router;
