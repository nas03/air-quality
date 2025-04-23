import { flag } from "@/config/constant";
import { db } from "@/config/db";
import type { IDistrictRepository } from "@/interfaces";

export class DistrictRepository implements IDistrictRepository {
	async findDistrict(district_id: string) {
		const query = await db
			.selectFrom("m_districts")
			.selectAll()
			.where("district_id", "=", district_id)
			.where("deleted", "=", flag.FALSE)
			.executeTakeFirst();

		return query ?? null;
	}

	async getAllDistricts() {
		const query = await db.selectFrom("m_districts").selectAll().execute();
		return query;
	}
}
