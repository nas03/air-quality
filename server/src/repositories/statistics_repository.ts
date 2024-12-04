import { db } from "@/config/db";
import { Statistics } from "@/helpers/types/db";
import { Selectable } from "kysely";

const getByDistrictID = async (district_id: string, time?: Date): Promise<Selectable<Statistics>[]> => {
  let query = db.selectFrom("statistics").where("district_id", "=", district_id);
  if (time) query.where("time", "=", time);
  const result = await query.selectAll().execute();
  return result;
};

const getDistrictHistory = async (district_id: string, startDate: Date, endDate: Date): Promise<Selectable<Statistics>[]> => {
  const query = db
    .selectFrom("statistics")
    .where((eb) => eb.and([eb("statistics.district_id", "=", district_id), eb.between("statistics.time", startDate, endDate)]))
    .selectAll()
    .execute();
  return await query;
};

const getRankByDate = async (time: Date): Promise<Selectable<Statistics>[]> => {
  const query = db.selectFrom("statistics").selectAll().where("time", "=", time);
  return await query.execute();
};

export { getByDistrictID, getDistrictHistory, getRankByDate };
