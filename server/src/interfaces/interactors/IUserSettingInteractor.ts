import { UserSetting } from "@/entities";

export interface IUserSettingInteractor {
  getUserSetting(user_id: number): Promise<UserSetting | null>;
}
