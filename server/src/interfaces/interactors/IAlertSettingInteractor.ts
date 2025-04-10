import { AlertSetting } from "@/entities";

export interface IAlertSettingInteractor {
    getAlertSettingByUserId(user_id: number): Promise<AlertSetting[]>;
    createAlertSetting(payload: Omit<AlertSetting, "id">): Promise<AlertSetting | null>;
    updateAlertSetting(
        id: number,
        payload: Partial<Omit<AlertSetting, "id" | "user_id">>,
    ): Promise<AlertSetting | null>;

    getUserAlertByDistrict(district_id: string);
}
