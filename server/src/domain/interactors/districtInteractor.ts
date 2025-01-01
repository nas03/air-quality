import { DistrictRepository } from "@/domain/repositories/districtRepository";
import { MDistrict } from "@/entities";
import { IDistrictInteractor } from "@/interfaces/interactors/IDistrictInteractor";
import { CacheService } from "@/services/cacheService";

export class DistrictInteractor implements IDistrictInteractor {
  private readonly districtRepository: DistrictRepository;
  private readonly cacheService: CacheService

  constructor(districtRepository: DistrictRepository) {
    this.districtRepository = districtRepository;
    this.cacheService = new CacheService()
  }

  async findDistrict(district_id: any): Promise<MDistrict | null> {
    const data = await this.districtRepository.findDistrict(district_id);
    return data;
  }

  async getAllDistrict(): Promise<MDistrict[]> {
    const data = await this.districtRepository.getAllDistricts();
    return data;
  }
}
