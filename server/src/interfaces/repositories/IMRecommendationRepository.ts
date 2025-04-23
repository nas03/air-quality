import type { MRecommendation } from "@/entities";

export interface IMRecommendationRepository {
	getAllRecommendations(): Promise<MRecommendation[]>;
}
