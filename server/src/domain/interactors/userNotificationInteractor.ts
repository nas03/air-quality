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
      const [notifications, mailTemplate] = await Promise.all([
        this.userNotificationRepository.getAllEmailNotifications(new Date("2024-11-30")),
        this.mailRepository.getMailFormat(1),
      ]);

      const emailPromises = notifications.map((notification) => {
        if (!notification.email) return null;

        const html = this.transformEmailHTML(mailTemplate.html, notification, [
          "recommendation",
          "aqi_index",
          "color",
        ]);

        return this.mailService.sendMail({
          to: notification.email,
          subject: "AQI Notification",
          html: html,
        });
      });

      await Promise.all(emailPromises);
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
