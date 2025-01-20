import { AUTHENTICATION, resMessage, statusCode } from "@/config/constant";
import { UserToken } from "@/domain/controllers/types";
import { UserInteractor } from "@/domain/interactors";
import { SecurityService } from "@/services/securityService";
import { Validator } from "@/services/validateService";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export class UserMiddleware {
  private securityService = new SecurityService();
  private userInteractor: UserInteractor;

  constructor(userInteractor: UserInteractor) {
    this.userInteractor = userInteractor;
  }

  validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userSchema = z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
        phone_number: z.string(),
      });
      const userValidator = new Validator(userSchema);
      userValidator.validate(req.body);
      next();
    } catch {
      res.status(400).json({
        status: "fail",
        message: resMessage.field_invalid,
      });
    }
  };

  validateSignin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userSchema = z.object({
        accountIdentifier: z.string(),
        password: z.string(),
      });
      const userValidator = new Validator(userSchema);
      userValidator.validate(req.body);
      next();
    } catch {
      res.status(400).json({
        status: "fail",
        message: resMessage.field_invalid,
      });
    }
  };

  authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorizeSchema = z.string().includes("Bearer");
      const authorizeValidator = new Validator(authorizeSchema);
      const access_token = authorizeValidator.validate(req.headers.authorization).split(" ")[1];
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
    } catch (error) {
      res.status(statusCode.UNAUTHORIZED).json({
        status: "error",
        message: resMessage.user_not_authorized,
      });
    }
  };
}
