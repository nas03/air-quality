import { getRankByDate } from "@/api";
import { MDistrict, Statistic } from "@/types/db";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export interface RankData {
  vn_district: string;
  aqi_index: number;
}

const useRankMutation = (time: string) => {
  const [tableData, setTableData] = useState<RankData[]>([]);

  const mutation = useMutation({
    mutationKey: ["rank", time],
    mutationFn: (date: string) => getRankByDate(date),
    networkMode: "offlineFirst",
    onSuccess: (data: (Statistic & MDistrict)[] | null) => {
      const resultData =
        data
          ?.map(({ vn_district, aqi_index }) => ({ vn_district, aqi_index }))
          .sort((a, b) => b.aqi_index - a.aqi_index) ?? [];
      setTableData(resultData);
    },
  });

  return { mutation, tableData };
};
export default useRankMutation;
