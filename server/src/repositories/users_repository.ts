import { db } from "@/config/db";
import { flag } from "@/helpers/const";
import { Users, UsersSession } from "@/helpers/types/db";
import { Insertable, Selectable } from "kysely";

const createUser = async (
  payload: Insertable<Pick<Users, "email" | "password" | "username">>
): Promise<Selectable<Pick<Users, "user_id">> | null> => {
  const query = await db.insertInto("users").values(payload).returning("user_id").executeTakeFirstOrThrow();
  return query;
};

const getUser = async (uniqueIdentity: string, type: "email" | "username"): Promise<Selectable<Users> | null> => {
  let query = db.selectFrom("users").where(type === "email" ? "email" : "username", "=", uniqueIdentity);
  return (await query.selectAll().executeTakeFirst()) ?? null;
};

const getUserLoginInfo = async (
  uniqueIdentity: string,
  type: "email" | "username",
  session_id: string
): Promise<Selectable<Pick<UsersSession, "session_id" | "user_id" | "deleted"> & Pick<Users, "password">> | null> => {
  const query = db
    .selectFrom("users_session as us")
    .leftJoin("users", "users.user_id", "us.user_id")
    .where(type === "email" ? "users.email" : "users.username", "=", uniqueIdentity)
    .select(["us.session_id", "us.deleted", "users.password", "us.user_id"])
    .where("us.session_id", "=", session_id)
    .where("us.deleted", "=", flag.FALSE);

  return (await query.executeTakeFirst()) ?? null;
};

export { createUser, getUser, getUserLoginInfo };
