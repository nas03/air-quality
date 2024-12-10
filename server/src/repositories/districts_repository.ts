import { db } from "@/config/db";
import { flag } from "@/helpers/const";
import { MDistricts } from "@/helpers/types/db";
import { Selectable } from "kysely";

const getAllDistricts = async (): Promise<Selectable<MDistricts>[]> => {
  const query = db
    .selectFrom("m_districts")
    .selectAll()
    .where("deleted", "=", flag.FALSE)
    .orderBy("vn_district asc")
    .execute();
  return query;
};

export { getAllDistricts };
