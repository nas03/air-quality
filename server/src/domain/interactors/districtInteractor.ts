import type { DistrictRepository } from "@/domain/repositories";
import type { IDistrictInteractor } from "@/interfaces";
import { CacheService } from "@/services";

export class DistrictInteractor implements IDistrictInteractor {
	private readonly districtRepository: DistrictRepository;
	private readonly cacheService: CacheService;

	constructor(districtRepository: DistrictRepository) {
		this.districtRepository = districtRepository;
		this.cacheService = new CacheService();
	}

	async findDistrict(district_id: string) {
		const data = await this.districtRepository.findDistrict(district_id);
		return data;
	}

	async getAllDistrict() {
		const data = await this.districtRepository.getAllDistricts();
		return data;
	}
}
