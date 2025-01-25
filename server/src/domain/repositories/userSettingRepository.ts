import { db } from "@/config/db";
import { IUserSettingRepository } from "@/interfaces";

export class UserSettingRepository implements IUserSettingRepository {
  async getAllUserEmail(filter: { email_notification?: boolean; phone_notification?: boolean }): Promise<string[]> {
    const query = db
      .selectFrom("users_setting as us")
      .innerJoin("users as u", "u.user_id", "us.user_id")
      .select("u.email")
      .where((eb) => {
        const conditions: any[] = [];
        if (filter.email_notification !== undefined) {
          conditions.push(eb("us.email_notification", "=", filter.email_notification));
        }
        if (filter.phone_notification !== undefined) {
          conditions.push(eb("us.phone_notification", "=", filter.phone_notification));
        }
        return eb.and(conditions);
      });

    const results = await query.execute();
    return results.map((r) => r.email);
  }
}
