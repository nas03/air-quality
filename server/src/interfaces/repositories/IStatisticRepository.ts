import { MDistrict, Statistic } from "@/entities";

export interface IStatisticRepository {
  getByDistrictID(district_id: string, time?: Date): Promise<(Statistic & MDistrict)[] | null>;
  getAQIStatisticsByProvince(
    province_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Pick<Statistic, "aqi_index"> & MDistrict)[]>;
  getAverageStatisticsByProvince(
    province_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Omit<Statistic, "district_id"> & Pick<MDistrict, "province_id" | "vn_province">)[]>;
  getDistrictHistory(
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict)[] | null>;
  getRankByDate(date: Date): Promise<(Statistic & MDistrict)[] | null>;
  getTimeList(): Promise<Pick<Statistic, "time">[]>;
}
