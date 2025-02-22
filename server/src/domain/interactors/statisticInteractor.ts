import { cacheTime } from "@/config/constant";
import { StatisticRepository } from "@/domain/repositories";
import { MDistrict, Statistic } from "@/entities";
import { IStatisticInteractor } from "@/interfaces";
import { CacheService } from "@/services";

export class StatisticInteractor implements IStatisticInteractor {
  private statisticRepository: StatisticRepository;
  private readonly cacheService: CacheService;
  constructor(statisticRepository: StatisticRepository) {
    this.statisticRepository = statisticRepository;
    this.cacheService = new CacheService();
  }
  getAQIStatisticsByProvince = async (province_id: string, start_date: Date, end_date: Date) => {
    const districtsData = await this.statisticRepository.getAQIStatisticsByProvince(
      province_id,
      start_date,
      end_date
    );
    const provinceData = await this.statisticRepository.getAverageStatisticsByProvince(
      province_id,
      start_date,
      end_date
    );
    return {
      districtsData: districtsData,
      provinceData,
    };
  };

  getByDistrictID = async (district_id: string, date?: Date) => {
    let hashKey = ["statistics", district_id, "date", date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getByDistrictID(district_id, date);

    if (data) {
      await this.cacheService.set(hashKey, data, cacheTime.DEV);
    }
    return data;
  };

  getDistrictHistory = async (district_id: string, start_date: Date, end_date: Date) => {
    let hashKey = ["statistics", district_id, "history", start_date, end_date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getDistrictHistory(
      district_id,
      start_date,
      end_date
    );
    if (data) {
      await this.cacheService.set(hashKey, data, cacheTime.DEV);
    }
    return data;
  };

  getRankByDate = async (date: Date) => {
    let hashKey = ["statistics", "rank", "date", date].join(":");
    const cache = await this.cacheService.get<(Statistic & MDistrict)[] | null>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getRankByDate(date);
    if (data) await this.cacheService.set(hashKey, data, cacheTime.DEV);
    return data;
  };

  getTimeList = async () => {
    let hashKey = ["statistics", "date", "*"].join(":");
    const cache = await this.cacheService.get<Pick<Statistic, "time">[]>(hashKey);
    if (cache) return cache;

    const data = await this.statisticRepository.getTimeList();

    if (data) await this.cacheService.set(hashKey, data, cacheTime.DEV);
    return data;
  };
}
