import { MDistrict, Statistic } from "@/entities";

export interface IStatisticInteractor {
  getByDistrictID(district_id: string): Promise<(Statistic & MDistrict)[] | null>;
  getDistrictHistory(
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict)[] | null>;
  getRankByDate(date: Date): Promise<(Statistic & MDistrict & { aqi_change: number })[] | null>;
  getTimeList(): Promise<Pick<Statistic, "time">[]>;
  getAQIStatisticsByProvince(province_id: string, start_date: Date, end_date: Date);
}
