import { MDistrict } from "@/entities";

export interface IDistrictInteractor {
  getAllDistrict(): Promise<MDistrict[]>;
  findDistrict(district_id): Promise<MDistrict | null>;
}
