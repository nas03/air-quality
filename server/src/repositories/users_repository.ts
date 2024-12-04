import { db } from "@/config/db";
import { Users } from "@/helpers/types/db";
import { Insertable, Selectable } from "kysely";

const createUser = async (payload: Insertable<Users>): Promise<Selectable<Pick<Users, "user_id">> | null> => {
  const query = await db.insertInto("users").values(payload).returning("user_id").executeTakeFirstOrThrow();
  return query;
};

const getUser = async (uniqueIdentity: string, type: "email" | "username"): Promise<Selectable<Users> | null> => {
  let query = db.selectFrom("users");
  if (type === "email") query = query.where("email", "=", uniqueIdentity);
  else query = query.where("username", "=", uniqueIdentity);

  return await query.selectAll().executeTakeFirstOrThrow();
};
export { createUser, getUser };
