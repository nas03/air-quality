import { MRecommendation } from "@/entities";

export interface IMRecommendationRepository {
    getAllRecommendations(): Promise<MRecommendation[]>;
}
