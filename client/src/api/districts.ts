import api from "@/config/api";
import { APIResponse, MDistrict } from "@/types";

export const getAllDistricts = async (): Promise<MDistrict[]> => {
  const query = await api.get<APIResponse<MDistrict[]>>("/districts");
  const data = query.data.data;
  return data;
};
