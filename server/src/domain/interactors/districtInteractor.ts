import { DistrictRepository } from "@/domain/repositories/districtRepository";
import { MDistrict } from "@/entities";
import { IDistrictInteractor } from "@/interfaces/interactors/IDistrictInteractor";

export class DistrictInteractor implements IDistrictInteractor {
  private readonly districtRepository: DistrictRepository;

  constructor(districtRepository: DistrictRepository) {
    this.districtRepository = districtRepository;
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
