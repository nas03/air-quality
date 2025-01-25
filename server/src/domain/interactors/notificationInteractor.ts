import { INotificationInteractor } from "@/interfaces";
import { MailService } from "@/services/mailService";

export class NotificationInteractor implements INotificationInteractor {
  private mailService: MailService;
  constructor() {
    this.mailService = new MailService();
  }

  async sendNotificationToAll(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async sendNotificationTo(user_id: number): Promise<boolean> {
    const params = {
      from: "sonanhguyen003@gmail.com",
      to: "sonanhguyen003@gmail.com",
      subject: "Test Mail",
    };
    await this.mailService.sendMail(params);
    return true;
  }
}
