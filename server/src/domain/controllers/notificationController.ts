import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { UserNotificationInteractor } from "@/domain/interactors";

import { Request, Response } from "express";
export class NotificationController extends BaseController<[UserNotificationInteractor]> {
  private notificationInteractor = this.interactors[0];
  
  onSendMail = async (req: Request, res: Response) => {
    const data = await this.notificationInteractor.sendEmailNotification();
    return res.status(statusCode.SUCCESS).json({
      data: data,
    });
  };

  onCreateNotification = async (req: Request, res: Response) => {
    const data = await this.notificationInteractor.createNotification();
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data,
    });
  };

  onGetUserNotification = async (req: Request, res: Response) => {
    const user_id = req.params["user_id"];
    if (!user_id || isNaN(Number(user_id)))
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        data: null,
      });
    const userNotifications = await this.notificationInteractor.getNotification(Number(user_id));
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: userNotifications,
    });
  };
}
