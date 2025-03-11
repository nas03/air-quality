import { ALERT_SETTING_KEY } from "@/config/redisKeys";
import { AlertSetting } from "@/entities";
import { IAlertSettingInteractor } from "@/interfaces";
import { CacheService } from "@/services";
import { AlertSettingRepository } from "../repositories";

export class AlertSettingInteractor implements IAlertSettingInteractor {
  private readonly alertSettingRepository: AlertSettingRepository;
  private readonly cacheService: CacheService;

  constructor(alertSettingRepository: AlertSettingRepository) {
    this.alertSettingRepository = alertSettingRepository;
    this.cacheService = new CacheService();
  }

  async getUserAlertByDistrict(district_id: string) {
    const alertSetting = await this.alertSettingRepository.getUserAlertByDistrict(district_id);
    return alertSetting;
  }

  async updateAlertSetting(id: number, payload: Partial<Omit<AlertSetting, "id" | "user_id">>) {
    const key = ALERT_SETTING_KEY.ID_KEY(id);
    return await this.cacheService.cache(key, () =>
      this.alertSettingRepository.updateAlertSetting(id, payload)
    );
  }

  async getAlertSettingByUserId(user_id: number) {
    const key = ALERT_SETTING_KEY.USER_KEY(user_id);
    const result = await this.cacheService.cache(key, () =>
      this.alertSettingRepository.getAlertSettingByUserId(user_id)
    );
    return result || [];
  }

  async createAlertSetting(payload: Omit<AlertSetting, "id">) {
    const data = await this.alertSettingRepository.createAlertSetting(payload);
    if (!data) return null;
    const key = ALERT_SETTING_KEY.ID_KEY(data.id);
    const userKey = ALERT_SETTING_KEY.USER_KEY(data.user_id);
    await this.cacheService.delete(userKey);
    return await this.cacheService.cache(key, data);
  }

  async deleteAlertSettingById(id: number) {
    const delAlert = await this.alertSettingRepository.deleteAlertSettingById(id);
    if (!delAlert) return false;
    const idKey = ALERT_SETTING_KEY.ID_KEY(id);
    const userKey = ALERT_SETTING_KEY.USER_KEY(delAlert.user_id);
    await Promise.all([this.cacheService.delete(idKey), this.cacheService.delete(userKey)]);
    return true;
  }
}
