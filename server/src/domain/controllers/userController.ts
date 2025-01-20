import { AUTHENTICATION, resMessage, statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { UserInteractor } from "@/domain/interactors";
import { SecurityService } from "@/services/securityService";
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
    if (isUserExists?.user_id) {
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
      role: AUTHENTICATION.USER_ROLE.USER,
    });

    return res.status(200).json({
      status: "success",
      data: newUser,
    });
  };
}
