import { getRankByDate } from "@/api";
import { MDistrict, Statistic } from "@/types/db";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export type RankData = Statistic & MDistrict & { aqi_change: number };

const useDistrictRanking = (time: string) => {
  const [tableData, setTableData] = useState<RankData[]>([]);

  /* const processRankData = (data: (Statistic & MDistrict)[] | null): RankData[] => {
    return (
      data
        ?.map(({ vn_district, aqi_index }) => ({ vn_district, aqi_index }))
        .sort((a, b) => b.aqi_index - a.aqi_index) ?? []
    );
  }; */

  const mutation = useMutation({
    mutationKey: ["rank", time],
    mutationFn: (date: string) => getRankByDate(date),
    networkMode: "offlineFirst",
    onSuccess: (data: (Statistic & MDistrict & { aqi_change: number })[] | null) => {
      setTableData(data || []);
    },
  });

  return { mutation, tableData };
};

export default useDistrictRanking;
