import { resMessage, statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { UserInteractor } from "@/domain/interactors";
import { SecurityService } from "@/external-libraries/securityService";
import { Request, Response } from "express";

export class UserController extends BaseController<UserInteractor> {
  onCreateUser = async (req: Request, res: Response) => {
    const body = req.body as {
      username: string;
      password: string;
      phone_number: string;
      email: string;
    };

    const isUserExists = await this.interactor.findUser(body.username);
    if (!isUserExists) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.user_existed,
        data: null,
      });
    }

    const hashedPassword = await new SecurityService().encryptString(body.password);
    const newUser = await this.interactor.createUser({
      username: body.username,
      phone_number: body.phone_number,
      email: body.email,
      password: hashedPassword,
    });

    return res.status(200).json({
      status: "success",
      data: newUser,
    });
  };

  onSignin = async (req: Request, res: Response) => {
    const body = req.body as {
      accountIdentifier: string;
      password: string;
    };

    const isUserExists = await this.interactor.findUser(body.accountIdentifier);
    if (!isUserExists) {
      return res.status(statusCode.SUCCESS).json({
        status: "success",
        message: resMessage.wrong_credentials,
        data: null,
      });
    }
    const securityService = new SecurityService();
    const validatePassword = await securityService.compareString(body.password, isUserExists.password);
    if (!validatePassword) {
      return res.status(statusCode.SUCCESS).json({
        status: "success",
        message: resMessage.wrong_credentials,
        data: null,
      });
    }

    const [access_token, refresh_token] = await Promise.all([
      securityService.createToken(
        { user_id: isUserExists.user_id, username: isUserExists.username },
        "15m"
      ),
      securityService.createToken(
        { user_id: isUserExists.user_id, username: isUserExists.username },
        "30d"
      ),
    ]);

    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: {
        access_token,
        refresh_token,
      },
    });
  };
}
