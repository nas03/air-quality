import type { MRecommendationRepository } from "@/domain/repositories";
import type { MRecommendation } from "@/entities";
import type { IMRecommendationInteractor } from "@/interfaces";

export class MRecommendationInteractor implements IMRecommendationInteractor {
	private mRecommendationRepository: MRecommendationRepository;

	constructor(mRecommendationRepository: MRecommendationRepository) {
		this.mRecommendationRepository = mRecommendationRepository;
	}

	async getAllRecommendations(): Promise<MRecommendation[]> {
		const data = await this.mRecommendationRepository.getAllRecommendations();
		return data;
	}
}
