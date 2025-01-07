import { MDistrict, Statistic } from "@/entities";

export interface IStatisticInteractor {
  getByDistrictID(district_id: string): Promise<(Statistic & { aqi_index: number } & MDistrict)[] | null>;
  getDistrictHistory(
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & { aqi_index: number } & MDistrict)[] | null>;
  getRankByDate(date: Date): Promise<(Statistic & MDistrict)[] | null>;
  getTimeList(): Promise<Pick<Statistic, "time">[]>;
}
