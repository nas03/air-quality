import api from "@/config/api";
import { APIResponse } from "@/types/api";
import { CronjobMonitor } from "@/types/db";

export const getAllCronjobs = async (start_date: string, end_date: string) => {
    const response = await api.get<APIResponse<CronjobMonitor[]>>(`/cronjob/record/all`, {
        params: {
            start_date: start_date,
            end_date: end_date,
        },
    });
    return response.data.data;
};
