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

  getByDistrictID = async (district_id: string, date?: Date): Promise<(Statistic & MDistrict)[] | null> => {
    let hashKey = ["statistics", district_id, "date", date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getByDistrictID(district_id, date);
    if (data) await this.cacheService.set(hashKey, data, 3600);
    return data;
  };

  getDistrictHistory = async (
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict)[] | null> => {
    let hashKey = ["statistics", district_id, "history", start_date, end_date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getDistrictHistory(district_id, start_date, end_date);
    if (data) await this.cacheService.set(hashKey, data, 3600);
    return data;
  };

  getRankByDate = async (date: Date): Promise<(Statistic & MDistrict)[] | null> => {
    let hashKey = ["statistics", "date", date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getRankByDate(date);
    if (data) await this.cacheService.set(hashKey, data, 3600);
    return data;
  };
}
