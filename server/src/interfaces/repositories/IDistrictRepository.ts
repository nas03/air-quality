import { MDistrict } from "@/entities";

export interface IDistrictRepository {
    getAllDistricts(): Promise<MDistrict[]>;
    findDistrict(district_id: string): Promise<MDistrict | null>;
}
