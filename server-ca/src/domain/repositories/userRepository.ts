import { db } from "@/config/db";
import { User } from "@/entities";
import { IUserRepository } from "@/interfaces";

export class UserRepository implements IUserRepository {
  createUser = async (data: User): Promise<User | null> => {
    const query = await db.insertInto("users").values(data).returningAll().executeTakeFirst();
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

    const result = await query.selectAll().executeTakeFirst();
    return result ?? null;
  };
}