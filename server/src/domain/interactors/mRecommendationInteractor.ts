import { MRecommendationRepository } from "@/domain/repositories";
import { MRecommendation } from "@/entities";
import { IMRecommendationInteractor } from "@/interfaces";

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
