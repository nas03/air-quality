import { catchAsync } from "@/domain/middlewares/catchAsync";
import authRouter from "@/domain/routes/authRoute";
import districtRouter from "@/domain/routes/districtRoutes";
import recommendationRouter from "@/domain/routes/mRecommendationRoute";
import stationsRouter from "@/domain/routes/stationsRoute";
import statisticRouter from "@/domain/routes/statisticRoutes";
import userRouter from "@/domain/routes/userRoutes";

import { Router } from "express";
import alertSettingRouter from "./alertSettingRoute";
import cronjobMonitorRoute from "./cronjobMonitorRoute";
import dataRoute from "./dataRoute";
import windDataRoute from "./windDataRoute";

const routes = [
    ...userRouter,
    ...statisticRouter,
    ...districtRouter,
    ...stationsRouter,
    ...authRouter,
    ...recommendationRouter,
    ...alertSettingRouter,
    ...windDataRoute,
    ...cronjobMonitorRoute,
    ...dataRoute,
];

// const userRepository = new UserRepository();
// const userInteractor = new UserInteractor(userRepository);
// const authMiddleware = new AuthMiddleware(userInteractor);
const router = Router();

for (const route of routes) {
    const { method, path, middleware, role, controller } = route;

    if (middleware?.length) {
        router.use(path, ...middleware);
    }
    if (role) {
        // router.use(path, authMiddleware.authorizeUser.bind(authMiddleware));
    }

    const handler = catchAsync(controller);
    switch (method) {
        case "GET":
            router.get(path, handler);
            break;
        case "POST":
            router.post(path, handler);
            break;
        case "PUT":
            router.put(path, handler);
            break;
        case "PATCH":
            router.patch(path, handler);
            break;
        case "DELETE":
            router.delete(path, handler);
            break;
    }
}

// Log router path
const logRoute = () => {
    const routePaths: {
        method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
        path: string;
    }[] = [];
    const colors = {
        get: "\x1b[32m", // Green
        post: "\x1b[34m", // Blue
        put: "\x1b[33m", // Yellow
        patch: "\x1b[36m", // Cyan
        delete: "\x1b[31m", // Red
        reset: "\x1b[0m", // Reset
    };

    for (const middleware of router.stack) {
        if (middleware.route) {
            const route = middleware.route;

            for (const method of Object.keys(route.stack[0].method)) {
                routePaths.push({
                    method: method.toUpperCase() as "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
                    path: middleware.route.path,
                });
            }
        } else if (middleware.name === "router") {
            const routerMiddleware = middleware as unknown as {
                handle: { stack: typeof router.stack };
            };
            for (const handler of routerMiddleware.handle.stack) {
                if (handler.route) {
                    const methods = Object.keys(handler.route.stack[0].method);
                    for (const method of methods) {
                        routePaths.push({
                            method: method.toUpperCase() as
                                | "GET"
                                | "POST"
                                | "DELETE"
                                | "PUT"
                                | "PATCH",
                            path: handler.route.path,
                        });
                    }
                }
            }
        }
    }

    // Print color-coded table
    console.log("\nAPI ROUTES:");

    // Table header
    console.log("+------------------------------------------+");
    console.log("| METHOD  | PATH                           |");
    console.log("+------------------------------------------+");

    // Table rows
    for (const route of routePaths) {
        const methodLower = route.method.toLowerCase();
        const color = colors[methodLower as keyof typeof colors] || colors.reset;
        console.log(
            `| ${color}${route.method.padEnd(7)}${colors.reset} | ${route.path.padEnd(30)} |`,
        );
        console.log("+------------------------------------------+");
    }
};
if (!["test", "prod"].includes(process.env.NODE_ENV as string)) logRoute();
export default router;
