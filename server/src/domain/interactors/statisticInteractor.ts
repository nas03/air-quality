import { cacheTime } from "@/config/constant";
import { calculateAQI } from "@/config/utils";
import { StatisticRepository } from "@/domain/repositories";
import { MDistrict, Statistic } from "@/entities";
import { IStatisticInteractor } from "@/interfaces/interactors/IStatisticInteractor";
import { CacheService } from "@/services/cacheService";

export class StatisticInteractor implements IStatisticInteractor {
  private statisticRepository: StatisticRepository;
  private readonly cacheService: CacheService;
  constructor(statisticRepository: StatisticRepository) {
    this.statisticRepository = statisticRepository;
    this.cacheService = new CacheService();
  }

  getByDistrictID = async (
    district_id: string,
    date?: Date
  ): Promise<(Statistic & { aqi_index: number } & MDistrict)[] | null> => {
    let hashKey = ["statistics", district_id, "date", date].join(":");
    const cache = await this.cacheService.get<(Statistic & { aqi_index: number } & MDistrict)[] | null>(
      hashKey
    );
    if (cache) return cache;

    const data = await this.statisticRepository.getByDistrictID(district_id, date);

    if (data) {
      const result = data.map((row) => ({ ...row, aqi_index: calculateAQI(row.pm_25) }));
      await this.cacheService.set(hashKey, result, cacheTime.DEV);
      return result;
    }
    return data;
  };

  getDistrictHistory = async (
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict & { aqi_index: number })[] | null> => {
    let hashKey = ["statistics", district_id, "history", start_date, end_date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict & { aqi_index: number })[] | null>(
      hashKey
    );
    if (cache) return cache;

    const data = await this.statisticRepository.getDistrictHistory(district_id, start_date, end_date);
    if (data) {
      const result = data.map((row) => ({ ...row, aqi_index: calculateAQI(row.pm_25) }));
      await this.cacheService.set(hashKey, result, cacheTime.DEV);
      return result;
    }
    return data;
  };

  getRankByDate = async (date: Date): Promise<(Statistic & MDistrict)[] | null> => {
    let hashKey = ["statistics", "rank", "date", date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getRankByDate(date);
    if (data) await this.cacheService.set(hashKey, data, cacheTime.DEV);
    return data;
  };

  getTimeList = async (): Promise<Pick<Statistic, "time">[]> => {
    let hashKey = ["statistics", "date", "*"].join(":");
    const cache = await this.cacheService.get<Pick<Statistic, "time">[]>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getTimeList();

    if (data) await this.cacheService.set(hashKey, data, cacheTime.DEV);
    return data;
  };
}
