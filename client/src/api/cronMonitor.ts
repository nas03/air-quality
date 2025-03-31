import api from "@/config/api";
import { APIResponse } from "@/types/api";
import { CronjobMonitor } from "@/types/db";

export const getAllCronjobs = async () => {
  const response = await api.get<APIResponse<CronjobMonitor[]>>(`/cronjob/record/all`);
  return response.data.data;
};
