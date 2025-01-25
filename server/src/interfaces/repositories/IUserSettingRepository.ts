export interface IUserSettingRepository {
  getAllUserEmail(filter: { email_notification?: boolean; phone_notification?: boolean }): Promise<string[]>;
}
