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
}
