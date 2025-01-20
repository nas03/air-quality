import api from "@/config/api";
import { APIResponse, MDistrict, Statistic } from "@/config/constants";

export const getTimeList = async (): Promise<string[]> => {
  const query = await api.get<APIResponse<string[]>>("/statistics/time-list");
  const data = query.data.data.map((el) => el.split("T")[0]);
  return data;
};

export const getStatisticHistoryByDistrict = async (
  district_id: string,
  start_date: string,
  end_date: string,
): Promise<(Statistic & MDistrict)[] | null> => {
  if (!district_id || !start_date || !end_date) {
    return null;
  }

  const response = await api.get<APIResponse<(Statistic & MDistrict)[] | null>>(
    `/statistics/district/${district_id}/history`,
    {
      params: { start_date, end_date },
    },
  );

  return response.data.data;
};

export const getStatisticByDistrict = async (
  district_id: string,
  date: string,
): Promise<(Statistic & MDistrict)[] | null> => {
  if (!district_id || !date) {
    return null;
  }

  const response = await api.get<APIResponse<(Statistic & MDistrict)[] | null>>(`/statistics/district/${district_id}`, {
    params: { date },
  });

  return response.data.data;
};

export const getRankByDate = async (date: string) => {
  if (!date) return [];
  const response = await api.get<APIResponse<(Statistic & MDistrict)[] | null>>("/statistics/ranking", {
    params: { date: date },
  });
  return response.data.data;
};
