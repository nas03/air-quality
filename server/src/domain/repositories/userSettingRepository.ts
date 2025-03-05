import { flag, receiveNotification } from "@/config/constant";
import { db } from "@/config/db";
import { IUserSettingRepository } from "@/interfaces";

export class UserSettingRepository implements IUserSettingRepository {
  async userEmailNotificationSettings() {
    const query = db
      .selectFrom("users_setting as us")
      .innerJoin("users as u", "u.user_id", "us.user_id")
      .select(["u.email", "u.user_id", "us.user_location"])
      .where("us.receive_notifications", "=", receiveNotification.EMAIL_NOTIFICATION);

    const results = await query.execute();
    return results;
  }

  getUserSetting = async (user_id: number) => {
    const query = await db
      .selectFrom("users_setting")
      .selectAll()
      .where("user_id", "=", user_id)
      .where("deleted", "=", flag.FALSE)
      .executeTakeFirst();
    return query ?? null;
  };
}
