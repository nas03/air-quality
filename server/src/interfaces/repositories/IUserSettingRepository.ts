type UserEmailNotification = {
  user_id: number;
  email: string;
  user_location: string | null;
};

export interface IUserSettingRepository {
  userEmailNotificationSettings(): Promise<UserEmailNotification[]>;
}
