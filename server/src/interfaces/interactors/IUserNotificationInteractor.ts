import { UserNotificationWithRecommendation } from "@/interfaces/repositories/IUserNotificationRepository";

export interface IUserNotificationInteractor {
  sendEmailNotification();
  getNotification(user_id: number): Promise<UserNotificationWithRecommendation[]>;
  createNotification(): Promise<boolean>;
}
