import { Route } from "@/config/constant/types";
import { UserController } from "@/domain/controllers";
import { UserInteractor, VerificationCodeInteractor } from "@/domain/interactors";
import { UserMiddleware } from "@/domain/middlewares/user.middleware";
import { UserRepository, VerificationCodeRepository } from "@/domain/repositories";

const userRepository = new UserRepository();
const verificationCodeRepository = new VerificationCodeRepository();
const userInteractor = new UserInteractor(userRepository);
const verificationCodeInteractor = new VerificationCodeInteractor(verificationCodeRepository);
const userController = new UserController(userInteractor, verificationCodeInteractor);
const userMiddleware = new UserMiddleware(userInteractor);

const userRouter: Route[] = [
    {
        path: "/users/signup",
        method: "POST",
        controller: userController.onCreateUser.bind(userController),
        role: "",
        middleware: [userMiddleware.validateCreateUser],
    },
    {
        path: "/user/update-info",
        method: "PUT",
        controller: userController.onUpdateUserBasicData.bind(userController),
        role: "user",
    },
    {
        path: "/user/update-password",
        method: "PUT",
        controller: userController.onUpdateUserPassword.bind(userController),
        role: "user",
    },
    {
        path: "/user/:user_id",
        method: "GET",
        controller: userController.onGetUserInfo.bind(userController),
        role: "user",
    },
];

export default userRouter;
