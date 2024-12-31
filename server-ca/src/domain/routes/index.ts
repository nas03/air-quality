import { UserInteractor } from "@/domain/interactors";
import { catchAsync } from "@/domain/middlewares/catchAsync";
import { UserMiddleware } from "@/domain/middlewares/user.middleware";
import { UserRepository } from "@/domain/repositories";
import statisticRouter from "@/domain/routes/statisticRoutes";
import userRouter from "@/domain/routes/userRoutes";
import { Router } from "express";

const routes = [...userRouter, ...statisticRouter];

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
    router.use(path, userMiddleware.authorizeUser.bind(userMiddleware));
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
    case "DELETE":
      router.delete(path, handler);
      break;
  }
});

router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    Object.keys(middleware.route.methods).forEach((method) => {
      console.log(`${method.toUpperCase()} ${middleware.route.path}`);
    });
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((handler: any) => {
      if (handler.route) {
        Object.keys(handler.route.methods).forEach((method) => {
          console.log(`${method.toUpperCase()} ${handler.route.path}`);
        });
      }
    });
  }
});
export default router;
