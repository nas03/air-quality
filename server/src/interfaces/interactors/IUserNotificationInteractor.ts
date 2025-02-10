import { UserNotificationWithRecommendation } from "@/interfaces/repositories/IUserNotificationRepository";

export interface IUserNotificationInteractor {
  sendEmailNotification(): Promise<boolean>;
  getNotification(user_id: number): Promise<UserNotificationWithRecommendation[]>;
  createNotification(): Promise<boolean>;
}
