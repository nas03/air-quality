import { UserSetting } from "@/entities";

type UserEmailNotification = {
  user_id: number;
  email: string;
  user_location: string | null;
};

export interface IUserSettingRepository {
  userEmailNotificationSettings(): Promise<UserEmailNotification[]>;
  getUserSetting(user_id: number): Promise<UserSetting | null>;
}
