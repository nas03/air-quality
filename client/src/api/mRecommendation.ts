import api from "@/config/api";
import { APIResponse } from "@/types/api";
import { MRecommendation } from "@/types/db";

export const getRecommendationDefinition = async (): Promise<MRecommendation[]> => {
  const response = await api.get<APIResponse<MRecommendation[]>>("/recommendations");
  return response.data.data;
};
