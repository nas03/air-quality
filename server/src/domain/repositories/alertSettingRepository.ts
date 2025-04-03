import { db } from "@/config/db";
import { AlertSetting } from "@/entities";
import { IAlertSettingRepository } from "@/interfaces";

export class AlertSettingRepository implements IAlertSettingRepository {
  async getUserAlertByDistrict(district_id: string) {
    const query = await db
      .selectFrom("alerts_setting as as")
      .leftJoin("m_districts as md", "md.district_id", "as.district_id")
      .select([
        "as.id",
        "as.district_id",
        "as.aqi_index",
        "as.wind_speed",
        "as.temperature",
        "as.temperature",
        "as.user_id",
        "as.pm_25",
        "md.vn_district",
        "md.vn_province",
        "md.vn_type",
      ])
      .where("as.district_id", "=", district_id)
      .executeTakeFirst();
    return { ...query };
  }

  async updateAlertSetting(id: number, payload: Partial<Omit<AlertSetting, "id" | "user_id">>) {
    const query = await db
      .updateTable("alerts_setting")
      .where("id", "=", id)
      .set(payload)
      .returningAll()
      .executeTakeFirst();

    return query ?? null;
  }
  async getAlertSettingByUserId(user_id: number): Promise<AlertSetting[]> {
    const query = await db
      .selectFrom("alerts_setting")
      .where("user_id", "=", user_id)
      .selectAll()
      .execute();
    return query;
  }

  async createAlertSetting(payload: Omit<AlertSetting, "id">): Promise<AlertSetting | null> {
    const query = await db
      .insertInto("alerts_setting")
      .values(payload)
      .onConflict((eb) => eb.columns(["user_id", "district_id"]).doNothing())
      .returningAll()
      .executeTakeFirst();
    return query ?? null;
  }

  async deleteAlertSettingById(id: number) {
    const result = await db
      .deleteFrom("alerts_setting")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return result ?? null;
  }
}
