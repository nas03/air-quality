import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { NotificationInteractor } from "@/domain/interactors";
import { Request, Response } from "express";
export class NotificationController extends BaseController<[NotificationInteractor]> {
  private notificationInteractor = this.interactors[0];
  onSendMail = async (req: Request, res: Response) => {
    const data = await this.notificationInteractor.sendEmailNotification();
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: data,
    });
  };
}
