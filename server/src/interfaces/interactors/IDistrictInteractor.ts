import type { MDistrict } from "@/entities";

export interface IDistrictInteractor {
	getAllDistrict(): Promise<MDistrict[]>;
	findDistrict(district_id: string): Promise<MDistrict | null>;
}
