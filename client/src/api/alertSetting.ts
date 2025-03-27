import api from "@/config/api";
import { APIResponse } from "@/types/api";
import { AlertSetting } from "@/types/db";

export const getUserAlertSetting = async (user_id: number): Promise<AlertSetting[]> => {
  try {
    const response = await api.get<APIResponse<AlertSetting[]>>(`/user/${user_id}/alert-settings`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createUserAlertSetting = async (payload: Omit<AlertSetting, "id">): Promise<AlertSetting | null> => {
  try {
    const response = await api.post<APIResponse<AlertSetting | null>>("/alert-settings", payload);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export type UserAlert = {
  id: number;
  aqi_index: boolean;
  temperature: {
    max: number;
    min: number;
    avg: number;
  };
  weather: string;
  wind_speed: number;
  date: string;
  location: string;
};
export const getUserAlertByDistrict = async (user_id: number, district_id: string) => {
  try {
    const response = await api.get<APIResponse<UserAlert[]>>(`/alert-settings/user/${user_id}`, {
      params: {
        district_id: district_id,
      },
    });
    return response.data.data;
  } catch (error) {
    return [];
  }
};

export const deleteUserAlertById = async (id: number) => {
  const response = await api.delete<APIResponse<null>>(`/alert-settings/${id}`);
  if (response.status === 200) return true;
  return false;
};

export const getWeatherByDistrict = async (district_id: string) => {
  const response = await api.get<APIResponse<Omit<UserAlert, "id" | "aqi_index">>>(
    `/alert-settings/district/${district_id}`,
  );
  return response.data.data;
};
