import { MailRepository, UserNotificationRepository } from "@/domain/repositories";
import { IUserNotificationInteractor } from "@/interfaces";
import { MailService } from "@/services";

export class UserNotificationInteractor implements IUserNotificationInteractor {
  constructor(
    private readonly mailService: MailService = new MailService(),
    private readonly userNotificationRepository: UserNotificationRepository = new UserNotificationRepository(),
    private readonly mailRepository: MailRepository = new MailRepository()
  ) {}

  private transformEmailHTML(html: string, data: Record<string, any>, fields: string[]): string {
    let processedHtml = html;
    fields.forEach((field) => {
      if (!data[field]) return;
      const placeholder = "${" + field + "}";
      processedHtml = processedHtml.replace(placeholder, String(data[field]));
    });
    return processedHtml;
  }

  async sendEmailNotification() {
    try {
      // const [notifications] = await Promise.all([
      //   this.userNotificationRepository.getAllEmailNotifications(new Date("2024-11-30")),
      // ]);

      // const sampleAqiData = {
      //   exceededDays: ["Thứ 3", "Thứ 5"],
      //   aqiDays: [
      //     { label: "04/04", value: 45 },
      //     { label: "04/04", value: 120 },
      //     { label: "04/04", value: 52 },
      //     { label: "04/04", value: 150 },
      //     { label: "04/04", value: 38 },
      //     { label: "04/04", value: 80 },
      //     { label: "04/05", value: 63 },
      //     { label: "04/05", value: 63 },
      //   ],
      // };
      // const mailHTML = emailTemplate(sampleAqiData.exceededDays, sampleAqiData.aqiDays);
      // // const emailPromises = notifications.map((notification) => {
      // //   if (!notification.email) return null;

      // //   return this.mailService.sendMail({
      // //     to: notification.email,
      // //     subject: "⚠️ Air Quality Alert: AQI Levels Exceeded Safe Thresholds",
      // //     html: mailHTML,
      // //   });
      // // });

      // // await Promise.all(emailPromises);
      // this.mailService.sendMail({
      //   to: "sonanhnguyen003@gmail.com",
      //   subject: "⚠️ Cảnh báo chất lượng không khí",
      //   html: mailHTML,
      // });
      return true;
    } catch (error) {
      console.error("Error sending email notifications:", error);
      return false;
    }
  }

  async getNotification(userId: number) {
    return this.userNotificationRepository.getUserNotification(userId);
  }

  async createNotification(date: Date = new Date("2024-11-30")): Promise<boolean> {
    const newNotifications = await this.userNotificationRepository.createNotification(date);
    return newNotifications.length > 0;
  }
}
