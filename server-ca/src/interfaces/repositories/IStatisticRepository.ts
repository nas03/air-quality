import { MDistrict, Statistic } from "@/entities";

export interface IStatisticRepository {
  getByDistrictID(district_id: string, time?: Date): Promise<(Statistic & MDistrict)[] | null>;

  getDistrictHistory(
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict)[] | null>;

  getRankByDate(date: Date): Promise<(Statistic & MDistrict)[] | null>;
}
