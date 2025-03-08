import { USER_SETTING_KEY } from "@/config/redisKeys";
import { UserSetting } from "@/entities";
import { IUserSettingInteractor } from "@/interfaces";
import { CacheService } from "@/services";
import { UserSettingRepository } from "../repositories";

export class UserSettingInteractor implements IUserSettingInteractor {
  private readonly userSettingRepository: UserSettingRepository;
  private readonly cacheService: CacheService;
  constructor(userSettingRepository: UserSettingRepository) {
    this.userSettingRepository = userSettingRepository;
    this.cacheService = new CacheService();
  }
  async getUserSetting(user_id: number): Promise<UserSetting | null> {
    const key = USER_SETTING_KEY.SETTING_ALL_KEY(user_id);
    return await this.cacheService.cache(key, () =>
      this.userSettingRepository.getUserSetting(user_id)
    );
  }
  createUserSetting = async (payload: Omit<UserSetting, "id">) => {
    const data = await this.userSettingRepository.createUserSetting(payload);
    if (!data) return null;
    const key = USER_SETTING_KEY.SETTING_ALL_KEY(Number(data.user_id));
    return await this.cacheService.cache(key, data);
  };
}
