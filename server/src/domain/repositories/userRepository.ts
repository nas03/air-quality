import { flag } from "@/config/constant";
import { db } from "@/config/db";
import { User } from "@/entities";
import { IUserRepository } from "@/interfaces";

export class UserRepository implements IUserRepository {
  createUser = async (data: User): Promise<Pick<User, "user_id" | "username"> | null> => {
    const query = await db.insertInto("users").values(data).returning(["user_id", "username"]).executeTakeFirst();
    return query ?? null;
  };

  updateUser = async (user_id: number): Promise<User | null> => {
    throw new Error("Method is not implemented");
  };

  findUser = async (input: { user_id?: number; email?: string; username?: string }): Promise<User | null> => {
    let query = db.selectFrom("users");

    if (input.user_id) query = query.where("user_id", "=", input.user_id);
    else if (input.email) query = query.where("email", "=", input.email);
    else if (input.username) query = query.where("username", "=", input.username);
    query = query.where("deleted", "=", flag.FALSE);

    const result = await query.selectAll().executeTakeFirst();
    return result ?? null;
  };

  deleteUser = async (user_id: number): Promise<User | null> => {
    const transaction = await db.transaction().execute(async (trx) => {
      const query = await trx
        .with("deleteUserAndFavorite", (qb) =>
          qb.updateTable("users_favorite").where("user_id", "=", user_id).set("deleted", flag.TRUE)
        )
        .with("deleteUserAndSession", (qb) =>
          qb.updateTable("users_session").where("user_id", "=", user_id).set("deleted", flag.TRUE)
        )
        .updateTable("users")
        .where("user_id", "=", user_id)
        .set("deleted", flag.TRUE)
        .returning(["email", "username", "password", "phone_number", "user_id", "role"])
        .executeTakeFirst();
      return query ?? null;
    });
    return transaction;
  };
}
