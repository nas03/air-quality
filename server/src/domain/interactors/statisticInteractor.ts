import { StatisticRepository } from "@/domain/repositories";
import { MDistrict, Statistic } from "@/entities";
import { CacheService } from "@/external-libraries/cacheService";
import { IStatisticInteractor } from "@/interfaces/interactors/IStatisticInteractor";

export class StatisticInteractor implements IStatisticInteractor {
  private statisticRepository: StatisticRepository;
  private cacheService = new CacheService();
  constructor(statisticRepository: StatisticRepository) {
    this.statisticRepository = statisticRepository;
  }

  getByDistrictID = async (district_id: string, date?: Date): Promise<(Statistic & MDistrict)[] | null> => {
    const data = await this.statisticRepository.getByDistrictID(district_id, date);
    return data;
  };

  getDistrictHistory = async (
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict)[] | null> => {
    const data = await this.statisticRepository.getDistrictHistory(district_id, start_date, end_date);
    return data;
  };

  getRankByDate = async (date: Date): Promise<(Statistic & MDistrict)[] | null> => {
    const data = await this.statisticRepository.getRankByDate(date);
    return data;
  };
}
