import { MailRepository, UserSettingRepository } from "@/domain/repositories";
import { INotificationInteractor } from "@/interfaces";
import { MailService } from "@/services";

export class NotificationInteractor implements INotificationInteractor {
  private mailService: MailService;
  private userSettingRepository: UserSettingRepository;
  private mailRepository: MailRepository;
  constructor() {
    this.mailService = new MailService();
    this.userSettingRepository = new UserSettingRepository();
    this.mailRepository = new MailRepository();
  }

  async sendEmailNotification() {
    const userEmailNotificationSettings = await this.userSettingRepository.getRecommendation(
      new Date("2024-11-30")
    );
    const getMail = await this.mailRepository.getMailFormat(1);
    let html = getMail.html;
    const sendMail = await Promise.all(
      userEmailNotificationSettings.map((el) => {
        const { recommendation, aqi_index, color } = el;
        const params = ["recommendation", "aqi_index", "color"];
        params
          .map((el) => "${" + el.toString() + "}")
          .forEach((param, index) => {
            html = html.replace(param, el[params[index]]);
          });

        return this.mailService.sendMail({
          to: el.email,
          subject: "AQI Notification",
          html: html,
        });
      })
    );
    return html;
  }
}
