import { Route } from "@/config/constant/types";
import { AuthController } from "@/domain/controllers/authController";
import { UserInteractor, VerificationCodeInteractor } from "@/domain/interactors";
import { UserValidationMiddleware } from "@/domain/middlewares/userValidation.middleware";
import { UserRepository, VerificationCodeRepository } from "@/domain/repositories";

const userRepository = new UserRepository();
const verificationRepository = new VerificationCodeRepository();
const userInteractor = new UserInteractor(userRepository);
const verificationInteractor = new VerificationCodeInteractor(verificationRepository);
const authController = new AuthController(userInteractor, verificationInteractor);
const authMiddleware = new UserValidationMiddleware();

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
    {
        path: "/auth/verification/:code",
        method: "POST",
        controller: authController.onVerifyVerificationCode.bind(authController),
        role: "",
    },
];

export default authRouter;
