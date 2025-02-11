import { MRecommendation, User, UserNotification } from "@/entities";

export interface UserNotificationWithRecommendation
  extends Omit<UserNotification, "recommendation_id">,
    Pick<MRecommendation, "en_recommendation" | "vn_recommendation" | "color"> {}

export interface AllEmailNotification
  extends UserNotificationWithRecommendation,
    Pick<User, "email"> {}

export interface IUserNotificationRepository {
  getUserNotification(user_id: number): Promise<UserNotificationWithRecommendation[]>;
  getAllEmailNotifications(date: Date): Promise<UserNotificationWithRecommendation[]>;
  createNotification(date: Date): Promise<UserNotification[]>;
}
