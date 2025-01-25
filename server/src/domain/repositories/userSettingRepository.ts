import { db } from "@/config/db";
import { IUserSettingRepository } from "@/interfaces";

export class UserSettingRepository implements IUserSettingRepository {
  async getRecommendation() {
    const getUserEmailSetting = db
      .selectFrom("users_setting as us")
      .innerJoin("users as u", "u.user_id", "us.user_id")
      .select(["u.email", "u.user_id", "us.user_location"])
      .where("us.email_notification", "=", true);

    const getRecommendation = getUserEmailSetting
      .leftJoin("statistics as s", (join) =>
        join.onRef("us.user_location", "=", "s.district_id").on("s.time", "=", new Date("2024-11-30"))
      )
      .leftJoin("m_recommendation as mr", (join) =>
        join.on((eb) =>
          eb.and([
            eb(eb.ref("mr.min_threshold"), "<=", eb.ref("s.aqi_index")),
            eb(eb.ref("mr.max_threshold"), ">=", eb.ref("s.aqi_index")),
          ])
        )
      )
      .select(["u.user_id", "us.user_location", "u.email", "mr.recommendation", "s.aqi_index", "mr.color"]);
    const result = await getRecommendation.execute();
    return result;
  }
  async userEmailNotificationSettings() {
    const query = db
      .selectFrom("users_setting as us")
      .innerJoin("users as u", "u.user_id", "us.user_id")
      .select(["u.email", "u.user_id", "us.user_location"])
      .where("us.email_notification", "=", true);

    const results = await query.execute();
    return results;
  }
}
