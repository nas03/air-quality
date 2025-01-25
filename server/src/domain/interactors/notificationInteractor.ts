import { UserSettingRepository } from "@/domain/repositories";
import { INotificationInteractor } from "@/interfaces";
import { MailService } from "@/services";

export class NotificationInteractor implements INotificationInteractor {
  private mailService: MailService;
  private userSettingRepository: UserSettingRepository;
  constructor() {
    this.mailService = new MailService();
    this.userSettingRepository = new UserSettingRepository();
  }

  async sendEmailNotification() {
    const userEmailNotificationSettings = await this.userSettingRepository.getRecommendation();

    const sendMail = await Promise.all(
      userEmailNotificationSettings.map((el) => {
        const { recommendation, aqi_index, color } = el;
        return this.mailService.sendMail({
          to: el.email,
          subject: "AQI Notification",
          html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AQI Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .aqi-box {
            font-size: 24px;
            font-weight: bold;
            padding: 15px;
            border-radius: 5px;
            color: #fff;
            margin: 10px 0;
            background-color: ${color};
        }
        .aqi-box span {
            color: #fff;
        }
        .recommendation {
            font-size: 16px;
            margin-top: 15px;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Air Quality Notification</h2>
        <p>The current Air Quality Index (AQI) in your area is:</p>
        <div class="aqi-box">
            <span>${aqi_index}</span>
        </div>
        <p class="recommendation">${recommendation}</p>
        <div class="footer">
            <p>Stay safe and take necessary precautions.</p>
        </div>
    </div>
</body>
</html>

`,
        });
      })
    );
    return userEmailNotificationSettings;
  }
}
