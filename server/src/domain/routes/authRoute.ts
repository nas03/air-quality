import type { Route } from "@/config/constant/types";
import { AuthController } from "@/domain/controllers/authController";
import { UserInteractor, VerificationCodeInteractor } from "@/domain/interactors";
import { UserRepository, VerificationCodeRepository } from "@/domain/repositories";

const userRepository = new UserRepository();
const verificationRepository = new VerificationCodeRepository();
const userInteractor = new UserInteractor(userRepository);
const verificationInteractor = new VerificationCodeInteractor(verificationRepository);
const authController = new AuthController(userInteractor, verificationInteractor);
// const authValidation = new AuthValidationMiddleware();

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
		middleware: [
			/* authValidation.validateSignin */
		],
	},
	{
		path: "/auth/logout",
		method: "POST",
		controller: authController.onSignedOut.bind(authController),
		role: "user",
	},
	{
		path: "/auth/verification/:code",
		method: "POST",
		controller: authController.onVerifyVerificationCode.bind(authController),
		role: "",
		middleware: [
			/* authValidation.validateVerifyCode */
		],
	},
	{
		path: "/auth/refresh-token",
		method: "POST",
		controller: authController.onRotateRefreshToken.bind(authController),
		role: "",
		middleware: [
			/* authValidation.validateRefreshToken */
		],
	},
	{
		path: "/auth/verify/admin",
		method: "POST",
		controller: authController.onVerifyAdmin.bind(authController),
		role: "",
	},
	{
		path: "/auth/verify/user",
		method: "POST",
		controller: authController.onVerifyUser.bind(authController),
		role: "",
	},
];

export default authRouter;
