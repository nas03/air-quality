import { db } from "@/config/db";
import { IUserNotificationRepository } from "@/interfaces/repositories/IUserNotificationRepository";

export class UserNotificationRepository implements IUserNotificationRepository {
  async getUserNotification(user_id: number) {
    const query = await db
      .selectFrom("users_notification as un")
      .leftJoin("users_setting as us", "us.user_id", "un.user_id")
      .leftJoin("m_recommendation as mr", "mr.id", "un.recommendation_id")
      .select([
        "un.timestamp",
        "un.aqi_index",
        "un.archived",
        "un.user_id",
        "un.location_id",
        "un.id",
        "mr.en_recommendation",
        "mr.vn_recommendation",
        "mr.color",
      ])
      .where("un.user_id", "=", user_id)
      .execute();
    return query;
  }

  async createNotification(date: Date) {
    const query = await db
      .with("user_aqi_data", (qb) =>
        qb
          .selectFrom("users_setting as us")
          .innerJoin("statistics as s", (join) =>
            join.onRef("us.user_location", "=", "s.district_id").on("s.time", "=", date)
          )
          .select(["us.user_location", "us.user_id", "s.aqi_index", "s.time"])
      )
      .with("recommendation_data", (qb) =>
        qb
          .selectFrom("user_aqi_data as uad")
          .innerJoin("m_recommendation as mr", (join) =>
            join.on((eb) =>
              eb.and([
                eb(eb.ref("mr.min_threshold"), "<=", eb.ref("uad.aqi_index")),
                eb(eb.ref("mr.max_threshold"), ">=", eb.ref("uad.aqi_index")),
              ])
            )
          )
          .select([
            "uad.aqi_index",
            "uad.user_location",
            "uad.user_id",
            "uad.time",
            "mr.id as recommendation_id",
          ])
      )
      .insertInto("users_notification")
      .columns(["aqi_index", "location_id", "recommendation_id", "timestamp", "user_id"])
      .expression((eb) =>
        eb
          .selectFrom("recommendation_data")
          .select([
            "aqi_index",
            "user_location as location_id",
            "recommendation_id",
            "time as timestamp",
            "user_id",
          ])
      )
      .onConflict((oc) =>
        oc
          .columns(["user_id", "timestamp"])
          .doUpdateSet((eb) => ({
            aqi_index: eb.ref("excluded.aqi_index"),
            location_id: eb.ref("excluded.location_id"),
            recommendation_id: eb.ref("excluded.recommendation_id"),
          }))
          .where((eb) => eb("users_notification.aqi_index", "!=", eb.ref("excluded.aqi_index")))
      )
      .returningAll()
      .execute();

    return query;
  }

  async getAllEmailNotifications(date: Date) {
    const query = await db
      .selectFrom("users_notification as un")
      .leftJoin("users_setting as us", "us.user_id", "un.user_id")
      .leftJoin("users", "users.user_id", "un.user_id")
      .leftJoin("m_recommendation as mr", "mr.id", "un.recommendation_id")
      .select([
        "un.timestamp",
        "un.aqi_index",
        "un.archived",
        "un.user_id",
        "users.email",
        "un.location_id",
        "un.id",
        "mr.en_recommendation",
        "mr.vn_recommendation",
        "mr.color",
      ])
      .where("timestamp", "=", date)
      .where("email_notification", "=", true)
      .execute();
    return query;
  }
}
