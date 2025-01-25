import { Route } from "@/config/constant/types";
import { AuthController } from "@/domain/controllers/authController";
import { UserInteractor } from "@/domain/interactors";
import { UserMiddleware } from "@/domain/middlewares/user.middleware";
import { UserRepository } from "@/domain/repositories";

const userRepository = new UserRepository();
const userInteractor = new UserInteractor(userRepository);
const authController = new AuthController(userInteractor);
const authMiddleware = new UserMiddleware(userInteractor);

const authRouter: Route[] = [
  /* {
    path: "/auths/signup",
    method: "POST",
    controller: authController.onCreateauth.bind(authController),
    role: "",
    middleware: [authMiddleware.validateCreateauth],
  }, */
  {
    path: "/auth/signin",
    method: "POST",
    controller: authController.onSignin.bind(authController),
    role: "",
    middleware: [authMiddleware.validateSignin],
  },
];

export default authRouter;
