import { db } from "@/config/db";
import { flag } from "@/helpers/const";
import { MDistricts, Statistics } from "@/helpers/types/db";
import { Selectable } from "kysely";

const getByDistrictID = async (district_id: string, time?: Date): Promise<Selectable<Statistics>[]> => {
  let query = db
    .selectFrom("statistics")
    .selectAll()
    .leftJoin("m_districts", "statistics.district_id", "m_districts.district_id")
    .where("statistics.district_id", "=", district_id);
  if (time) query.where("statistics.time", "=", time);
  return await query.execute();
};

const getDistrictHistory = async (
  district_id: string,
  startDate: Date,
  endDate: Date
): Promise<
  (Selectable<Omit<Statistics, "created_at" | "updated_at" | "deleted">> &
    Selectable<Omit<MDistricts, "created_at" | "updated_at" | "deleted" | "district_id">>)[]
> => {
  const query = db
    .selectFrom("statistics")
    .leftJoin("m_districts", "m_districts.district_id", "statistics.district_id")
    .select([
      "statistics.id",
      "statistics.pm_25",
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
        .and([eb("statistics.district_id", "=", district_id), eb.between("statistics.time", startDate, endDate)])
        .and("statistics.deleted", "=", flag.FALSE)
        .and("m_districts.deleted", "=", flag.FALSE)
    );

  return await query.execute();
};

const getRankByDate = async (
  time: Date
): Promise<
  (Selectable<Omit<Statistics, "created_at" | "updated_at" | "deleted">> &
    Selectable<Omit<MDistricts, "created_at" | "updated_at" | "deleted" | "district_id">>)[]
> => {
  const query = db
    .selectFrom("statistics")
    .leftJoin("m_districts", "m_districts.district_id", "statistics.district_id")
    .select([
      "statistics.id",
      "statistics.pm_25",
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
      eb.and([
        eb("statistics.time", "=", new Date(time.setHours(0, 0, 0, 0))),
        eb("statistics.deleted", "=", flag.FALSE),
        eb("m_districts.deleted", "=", flag.FALSE)
      ])
    );

  return await query.execute();
};

export { getByDistrictID, getDistrictHistory, getRankByDate };
