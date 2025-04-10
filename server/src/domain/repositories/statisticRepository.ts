import { flag } from "@/config/constant";
import { db } from "@/config/db";
import { MDistrict, Statistic } from "@/entities";
import { IStatisticRepository } from "@/interfaces";
import { sql } from "kysely";

export class StatisticRepository implements IStatisticRepository {
    async getAQIStatisticsByProvince(province_id: string, start_date: Date, end_date: Date) {
        const getAverageQuery = db
            .selectFrom("statistics as s")
            .leftJoin("m_districts as md", "md.district_id", "s.district_id")
            .select([
                sql<number>`avg(aqi_index)`.as("aqi_index"),
                sql<number>`avg(pm_25)`.as("pm_25"),
                "s.district_id",
            ])
            .groupBy("s.district_id")
            .where((eb) =>
                eb.and([
                    eb.between("time", start_date, end_date),
                    eb("md.province_id", "=", province_id),
                ]),
            )
            .as("st");

        const query = db
            .selectFrom(getAverageQuery)
            .leftJoin("m_districts as md", "st.district_id", "md.district_id")
            .select([
                "st.aqi_index",
                "st.pm_25",
                "md.district_id",
                "md.province_id",
                "md.vn_province",
                "md.vn_district",
                "md.eng_district",
                "md.vn_type",
                "md.eng_type",
            ]);

        return await query.execute();
    }

    getAverageStatisticsByProvince = async (
        province_id: string,
        start_date: Date,
        end_date: Date,
    ) => {
        const query = db
            .selectFrom("statistics as s")
            .leftJoin("m_districts as md", "md.district_id", "s.district_id")
            .select([
                sql<number>`avg(s.aqi_index)`.as("aqi_index"),
                sql<number>`avg(s.pm_25)`.as("pm_25"),
                "md.province_id",
                "md.vn_province",
                "s.time",
            ])
            .where((eb) =>
                eb.and([
                    eb.between("time", start_date, end_date),
                    eb("md.province_id", "=", province_id),
                ]),
            )
            .groupBy(["md.province_id", "md.vn_province", "time"]);

        return await query.execute();
    };
    async getByDistrictID(
        district_id: string,
        date?: Date,
    ): Promise<(Statistic & MDistrict)[] | null> {
        let query = db
            .selectFrom("statistics")
            .innerJoin("m_districts", "statistics.district_id", "m_districts.district_id")
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
        end_date: Date,
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
                    ])
                    .and("statistics.deleted", "=", flag.FALSE)
                    .and("m_districts.deleted", "=", flag.FALSE),
            );

        return await query.execute();
    }
    async getRankByDate(date: Date) {
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
                sql<number>`statistics.aqi_index - COALESCE((
        SELECT s.aqi_index 
        FROM statistics as s 
        WHERE s.district_id = statistics.district_id 
        AND s.time = ${new Date(new Date(date).getTime() - 24 * 60 * 60 * 1000)}
        LIMIT 1
      ), 0)`.as("aqi_change"),
            ])
            .where((eb) =>
                eb.and([
                    eb("statistics.time", "=", date),
                    eb("statistics.deleted", "=", flag.FALSE),
                    eb("m_districts.deleted", "=", flag.FALSE),
                ]),
            );

        return await query.execute();
    }

    async getTimeList(): Promise<Pick<Statistic, "time">[]> {
        const query = await db
            .selectFrom("statistics")
            .select("time")
            .groupBy("time")
            .orderBy("time", "desc")
            .limit(10)
            .execute();
        return query;
    }

    async getAllForecastAlert() {
        const getDate = await db
            .selectFrom("statistics")
            .select("time")
            .groupBy("time")
            .orderBy("time desc")
            .limit(8)
            .execute();
        const query = await db
            .selectFrom("statistics")
            .innerJoin("m_districts as md", "md.district_id", "statistics.district_id")
            .selectAll()
            .where((eb) => eb.between("statistics.time", getDate[7].time, getDate[0].time))
            .orderBy("time asc")
            .execute();

        const resultMap = query.reduce((map, data) => {
            const item = map.get(data.district_id);
            if (item)
                return map.set(data.district_id, {
                    ...item,
                    forecast: [...item.forecast, { aqi_index: data.aqi_index, time: data.time }],
                });
            else
                return map.set(data.district_id, {
                    ...data,
                    forecast: [{ aqi_index: data.aqi_index, time: data.time }],
                });
        }, new Map<string, MDistrict & { forecast: Pick<Statistic, "time" | "aqi_index">[] }>());

        return Object.fromEntries(resultMap);
    }
}
