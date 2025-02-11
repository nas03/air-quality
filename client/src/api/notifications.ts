import api from "@/config/api";
import { APIResponse } from "@/types/api";
import { MRecommendation, UserNotification } from "@/types/db";
export interface UserNotificationWithRecommendation
  extends Omit<UserNotification, "recommendation_id">,
    Pick<MRecommendation, "vn_recommendation" | "en_recommendation" | "color"> {}
export const getUserNotification = async (user_id: number) => {
  try {
    const data = await api.get<APIResponse<UserNotificationWithRecommendation[]>>(`/notification/${user_id}`);
    return data.data.data;
  } catch {
    return [];
  }
};
