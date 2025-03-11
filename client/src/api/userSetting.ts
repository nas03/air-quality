import api from "@/config/api";
import { APIResponse } from "@/types/api";
import { receiveNotification } from "@/types/consts";
import { UserSetting } from "@/types/db";

export const getUserSetting = async (user_id: number) => {
  try {
    const data = await api.get<APIResponse<UserSetting | null>>(`/user/${user_id}/settings`);
    return data.data.data ?? null;
  } catch (error) {
    return null;
  }
};

export type AlertInfoType = {
  district_id: string;
  province_id: string;
  aqi_index: boolean;
  temperature: boolean;
  wind: boolean;
  sms_notification: boolean;
  email_notification: boolean;
};
export const updateUserSetting = async (user_id: number | undefined, payload: AlertInfoType) => {
  try {
    if (!user_id) return null;
    let receive_notifications = payload.sms_notification
      ? payload.email_notification
        ? receiveNotification.BOTH
        : receiveNotification.SMS_NOTIFICATION
      : receiveNotification.DISABLED;
    const response = await api.post<APIResponse<UserSetting | null>>(`/user/settings`, {
      user_id: user_id,
      user_location: payload.district_id,
      receive_notifications: receive_notifications,
      profile_url: null,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
