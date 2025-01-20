import { Route } from "@/config/constant/type";
import { UserController } from "@/domain/controllers";
import { UserInteractor } from "@/domain/interactors";
import { UserMiddleware } from "@/domain/middlewares/user.middleware";
import { UserRepository } from "@/domain/repositories";

const userRepository = new UserRepository();
const userInteractor = new UserInteractor(userRepository);
const userController = new UserController(userInteractor);
const userMiddleware = new UserMiddleware(userInteractor);
// const userRouter = Router();

const userRouter: Route[] = [
  {
    path: "/users/signup",
    method: "POST",
    controller: userController.onCreateUser.bind(userController),
    role: "",
    middleware: [userMiddleware.validateCreateUser],
  },
];

export default userRouter;
