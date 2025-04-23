import { db } from "@/config/db";
import type { MRecommendation } from "@/entities";
import type { IMRecommendationRepository } from "@/interfaces";

export class MRecommendationRepository implements IMRecommendationRepository {
	async getAllRecommendations(): Promise<MRecommendation[]> {
		const query = await db.selectFrom("m_recommendation").selectAll().execute();
		return query;
	}
}
