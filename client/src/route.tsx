import {
    AdminPage,
    AnalyticsDashboard,
    AppPage,
    CodeVerificationPage,
    LandingPage,
    SigninPage,
    SignupPage,
} from "@/pages";
import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import api from "./config/api";

export const rootRoute = createRootRoute();

// Public route
const publicRoute = createRoute({
    id: "public",
    getParentRoute: () => rootRoute,
});

// Sub route
const subRoute = createRoute({
    id: "sub",
    getParentRoute: () => rootRoute,
});

// Protected user route
const protectUserRoute = createRoute({
    id: "protected",
    getParentRoute: () => rootRoute,
    beforeLoad: async () => {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) throw redirect({ to: "/signin" });
        await api.post("/auth/verify/user", { access_token: accessToken }).catch(() => {
            throw redirect({ to: "/signin" });
        });
    },
});

// Protected admin route
const protectAdminRoute = createRoute({
    id: "admin",
    getParentRoute: () => rootRoute,
    beforeLoad: async () => {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) throw redirect({ to: "/signin" });
        await api.post("/auth/verify/admin", { access_token: accessToken }).catch(() => {
            throw redirect({ to: "/" });
        });
    },
});

/* PRIVATE ROUTE */
const adminRoute = createRoute({
    getParentRoute: () => protectAdminRoute,
    path: "/admin",
    component: AdminPage,
});

const analyticsRoute = createRoute({
    getParentRoute: () => protectUserRoute,
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
    getParentRoute: () => subRoute,
    path: "/home",
    component: LandingPage,
});

const emailVerificationRoute = createRoute({
    getParentRoute: () => subRoute,
    path: "/verification",
    component: CodeVerificationPage,
});

/* ROUTE TREE */
const protectedRouteTree = protectUserRoute.addChildren([analyticsRoute]);
const adminProtectRoute = protectAdminRoute.addChildren([adminRoute]);
const publicRouteTree = publicRoute.addChildren([signInRoute, homeRoute, signUpRoute]);
const subRouteTree = subRoute.addChildren([landingRoute, emailVerificationRoute]);

const routeTree = rootRoute.addChildren([adminProtectRoute, protectedRouteTree, publicRouteTree, subRouteTree]);

const router = createRouter({ routeTree });

export default router;
