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

// Route definitions
const routes = {
    public: createRoute({
        id: "public",
        getParentRoute: () => rootRoute,
    }),

    sub: createRoute({
        id: "sub",
        getParentRoute: () => rootRoute,
    }),

    protectedUser: createRoute({
        id: "protected",
        getParentRoute: () => rootRoute,
        beforeLoad: async () => {
            const accessToken = sessionStorage.getItem("access_token");
            if (!accessToken) throw redirect({ to: "/signin" });
            await api.post("/auth/verify/user", { access_token: accessToken }).catch(() => {
                throw redirect({ to: "/signin" });
            });
        },
    }),
    protectedAdmin: createRoute({
        id: "admin",
        getParentRoute: () => rootRoute,
        beforeLoad: async () => {
            const accessToken = sessionStorage.getItem("access_token");
            if (!accessToken) throw redirect({ to: "/signin" });
            await api.post("/auth/verify/admin", { access_token: accessToken }).catch(() => {
                throw redirect({ to: "/" });
            });
        },
    }),
};

// Page routes
const pageRoutes = {
    admin: createRoute({
        getParentRoute: () => routes.protectedAdmin,
        path: "/admin",
        component: AdminPage,
    }),
    analytics: createRoute({
        getParentRoute: () => routes.protectedUser,
        path: "/analytics",
        component: AnalyticsDashboard,
    }),
    signIn: createRoute({
        getParentRoute: () => routes.public,
        path: "/signin",
        component: SigninPage,
    }),
    signUp: createRoute({
        getParentRoute: () => routes.public,
        path: "/signup",
        component: SignupPage,
    }),
    home: createRoute({
        getParentRoute: () => routes.public,
        path: "/",
        component: AppPage,
    }),
    landing: createRoute({
        getParentRoute: () => routes.sub,
        path: "/home",
        component: LandingPage,
    }),
    emailVerification: createRoute({
        getParentRoute: () => routes.sub,
        path: "/verification",
        component: CodeVerificationPage,
    }),
};

// Route tree construction
const protectedRouteTree = routes.protectedUser.addChildren([pageRoutes.analytics]);
const adminProtectRoute = routes.protectedAdmin.addChildren([pageRoutes.admin]);
const publicRouteTree = routes.public.addChildren([pageRoutes.signIn, pageRoutes.home, pageRoutes.signUp]);
const subRouteTree = routes.sub.addChildren([pageRoutes.landing, pageRoutes.emailVerification]);

const routeTree = rootRoute.addChildren([adminProtectRoute, protectedRouteTree, publicRouteTree, subRouteTree]);

const router = createRouter({ routeTree });
// Declare the router types
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default router;
