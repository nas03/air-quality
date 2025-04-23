import { AUTHENTICATION, resMessage, statusCode } from "@/config/constant";
import { SecurityService, Validator } from "@/services";
import type { NextFunction, Request, Response } from "express";
import z from "zod";
import type { UserToken } from "../controllers/types";
import type { UserInteractor } from "../interactors";

export class AuthMiddleware {
	private securityService = new SecurityService();
	private userInteractor: UserInteractor;
	constructor(userInteractor: UserInteractor) {
		this.userInteractor = userInteractor;
	}

	authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authorizeSchema = z.string().includes("Bearer");
			const authorizeValidator = new Validator(authorizeSchema);
			const access_token = authorizeValidator
				.validate(req.headers.authorization)
				.split(" ")[1];
			if (!access_token) {
				throw Error(resMessage.user_not_authorized);
			}

			const verifiedToken = this.securityService.verifyToken(access_token);
			if (verifiedToken === AUTHENTICATION.TOKEN_VERIFICATION.VALID) {
				const decodedToken = this.securityService.decodeToken<UserToken>(access_token);
				const findUser = await this.userInteractor.findUser(Number(decodedToken?.user_id));
				if (!findUser) {
					throw Error(resMessage.user_not_exists);
				}
			} else throw Error(resMessage.user_not_authorized);
			next();
		} catch {
			res.status(statusCode.UNAUTHORIZED).json({
				status: "error",
				message: resMessage.user_not_authorized,
			});
		}
	};
}
