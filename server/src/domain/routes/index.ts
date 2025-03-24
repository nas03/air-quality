import { UserInteractor } from "@/domain/interactors";
import { catchAsync } from "@/domain/middlewares/catchAsync";
import { UserMiddleware } from "@/domain/middlewares/user.middleware";
import { UserRepository } from "@/domain/repositories";
import authRouter from "@/domain/routes/authRoute";
import districtRouter from "@/domain/routes/districtRoutes";
import recommendationRouter from "@/domain/routes/mRecommendationRoute";
import stationsRouter from "@/domain/routes/stationsRoute";
import statisticRouter from "@/domain/routes/statisticRoutes";
import notificationRouter from "@/domain/routes/userNotificationRoute";
import userRouter from "@/domain/routes/userRoutes";
import { Router } from "express";
import alertSettingRouter from "./alertSettingRoute";
import cronjobMonitorRoute from "./cronjobMonitorRoute";
import userSettingRouter from "./userSettingRoute";
import windDataRoute from "./windDataRoute";

const routes = [
  ...userRouter,
  ...statisticRouter,
  ...districtRouter,
  ...stationsRouter,
  ...authRouter,
  ...notificationRouter,
  ...recommendationRouter,
  ...userSettingRouter,
  ...alertSettingRouter,
  ...windDataRoute,
  ...cronjobMonitorRoute,
];

const userRepository = new UserRepository();
const userInteractor = new UserInteractor(userRepository);
const userMiddleware = new UserMiddleware(userInteractor);
const router = Router();

routes.forEach((route) => {
  const { method, path, middleware, role, controller } = route;

  if (middleware) {
    router.use(path, middleware);
  }
  if (role === "user") {
    // router.use(path, userMiddleware.authorizeUser.bind(userMiddleware));
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
});

// Log router path
// Log router paths in a color-coded table
const routePaths: { method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"; path: string }[] = [];
const colors = {
  get: "\x1b[32m", // Green
  post: "\x1b[34m", // Blue
  put: "\x1b[33m", // Yellow
  patch: "\x1b[36m", // Cyan
  delete: "\x1b[31m", // Red
  reset: "\x1b[0m", // Reset
};

router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    Object.keys(middleware.route.methods).forEach((method) => {
      routePaths.push({
        method: method.toUpperCase() as "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
        path: middleware.route.path,
      });
    });
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        Object.keys(handler.route.methods).forEach((method) => {
          routePaths.push({
            method: method.toUpperCase() as "GET" | "POST" | "DELETE" | "PUT" | "PATCH",
            path: handler.route.path,
          });
        });
      }
    });
  }
});

// Print color-coded table
console.log("\nAPI ROUTES:");

// Table header
console.log("+------------------------------------------+");
console.log("| METHOD  | PATH                           |");
console.log("+------------------------------------------+");

// Table rows
routePaths.forEach((route) => {
  const methodLower = route.method.toLowerCase();
  const color = colors[methodLower] || colors.reset;
  console.log(` ${color}${route.method.padEnd(7)}${colors.reset} | ${route.path.padEnd(30)} `);
  console.log("------------------------------------------");
});
export default router;
