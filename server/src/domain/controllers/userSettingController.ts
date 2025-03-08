import { resMessage, statusCode } from "@/config/constant";
import { Request, Response } from "express";
import { UserSettingInteractor } from "../interactors";
import { BaseController } from "./baseController";

export class UserSettingController extends BaseController<[UserSettingInteractor]> {
  private readonly userSettingInteractor = this.interactors[0];
  onGetUserSetting = async (req: Request, res: Response) => {
    const user_id = req.params["user_id"];
    if (!user_id) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.field_invalid,
        data: null,
      });
    }
    const userSetting = await this.userSettingInteractor.getUserSetting(Number(user_id));
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: userSetting,
    });
  };

  onCreateUserSetting = async (req: Request, res: Response) => {
    const body = req.body as {
      user_id: number;
      user_location: string;
      receive_notifications: number;
      profile_url: string | null;
    };
    const newUserSetting = await this.userSettingInteractor.createUserSetting({
      user_id: body.user_id,
      profile_url: body.profile_url,
      receive_notifications: body.receive_notifications,
      user_location: body.user_location,
    });

    if (!newUserSetting) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "error",
        message: resMessage.server_error,
      });
    }
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: newUserSetting,
    });
  };
}
