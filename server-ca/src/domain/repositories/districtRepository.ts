import { flag } from "@/config/constant";
import { db } from "@/config/db";
import { MDistrict } from "@/entities";
import { IDistrictRepository } from "@/interfaces/repositories/IDistrictRepository";

export class DistrictRepository implements IDistrictRepository {
  async findDistrict(district_id: string): Promise<MDistrict | null> {
    const query = await db
      .selectFrom("m_districts")
      .selectAll()
      .where("district_id", "=", district_id)
      .where("deleted", "=", flag.FALSE)
      .executeTakeFirst();

    return query ?? null;
  }

  async getAllDistricts(): Promise<MDistrict[]> {
    const query = await db.selectFrom("m_districts").selectAll().execute();
    return query;
  }
}
