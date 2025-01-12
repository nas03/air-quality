import { flag } from "@/config/constant";
import { db } from "@/config/db";
import { MDistrict, Statistic } from "@/entities";
import { IStatisticRepository } from "@/interfaces";

export class StatisticRepository implements IStatisticRepository {
  async getByDistrictID(district_id: string, date?: Date): Promise<(Statistic & MDistrict)[] | null> {
    let query = db
      .selectFrom("statistics")
      .leftJoin("m_districts", "statistics.district_id", "m_districts.district_id")
      .select([
        "statistics.id",
        "statistics.pm_25",
        "statistics.aqi_index",
        "statistics.time",
        "m_districts.district_id",
        "m_districts.province_id",
        "m_districts.vn_province",
        "m_districts.vn_district",
        "m_districts.eng_district",
        "m_districts.vn_type",
        "m_districts.eng_type",
      ])
      .where("statistics.district_id", "=", district_id);
    if (date) query = query.where("statistics.time", "=", date);
    const result = await query.execute();
    return result ?? null;
  }

  async getDistrictHistory(
    district_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<(Statistic & MDistrict)[] | null> {
    const query = db
      .selectFrom("statistics")
      .leftJoin("m_districts", "m_districts.district_id", "statistics.district_id")
      .select([
        "statistics.id",
        "statistics.pm_25",
        "statistics.aqi_index",
        "statistics.time",
        "statistics.district_id",
        "m_districts.province_id",
        "m_districts.vn_district",
        "m_districts.vn_type",
        "m_districts.eng_district",
        "m_districts.eng_type",
        "m_districts.vn_province",
      ])
      .where((eb) =>
        eb
          .and([
            eb("statistics.district_id", "=", district_id),
            eb.between("statistics.time", start_date, end_date),
            eb("statistics.district_id", "is not", null),
          ])
          .and("statistics.deleted", "=", flag.FALSE)
          .and("m_districts.deleted", "=", flag.FALSE)
      );

    return await query.execute();
  }
  async getRankByDate(date: Date): Promise<(Statistic & MDistrict)[] | null> {
    console.log({ date });
    const query = db
      .selectFrom("statistics")
      .leftJoin("m_districts", "m_districts.district_id", "statistics.district_id")
      .select([
        "statistics.id",
        "statistics.pm_25",
        "statistics.aqi_index",
        "statistics.district_id",
        "statistics.time",
        "m_districts.province_id",
        "m_districts.vn_district",
        "m_districts.vn_type",
        "m_districts.eng_district",
        "m_districts.eng_type",
        "m_districts.vn_province",
      ])
      .where((eb) =>
        eb.and([
          eb("statistics.time", "=", date),
          eb("statistics.deleted", "=", flag.FALSE),
          eb("m_districts.deleted", "=", flag.FALSE),
        ])
      );

    return await query.execute();
  }

  async getTimeList(): Promise<Pick<Statistic, "time">[]> {
    const query = await db
      .selectFrom("statistics")
      .select("time")
      .groupBy("time")
      .orderBy("time", "asc")
      .execute();
    return query;
  }
}
