import { db } from "@/config/db";
import { IUserSettingRepository } from "@/interfaces";

export class UserSettingRepository implements IUserSettingRepository {
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
