import type { MRecommendation } from "@/entities";

export interface IMRecommendationInteractor {
	getAllRecommendations(): Promise<MRecommendation[]>;
}
