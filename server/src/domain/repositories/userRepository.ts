import { flag } from "@/config/constant";
import { db } from "@/config/db";
import type { User } from "@/entities";
import type { IUserRepository } from "@/interfaces";

export class UserRepository implements IUserRepository {
    createUser = async (data: Omit<User, "user_id" | "account_status">) => {
        const query = await db.insertInto("users").values(data).returningAll().executeTakeFirst();
        return query ?? null;
    };

    updateUser = async (user_id: number, payload: Partial<Omit<User, "role" | "user_id">>) => {
        const query = await db
            .updateTable("users")
            .set(payload)
            .where("user_id", "=", user_id)
            .returningAll()
            .executeTakeFirst();
        return query ?? null;
    };

    findUser = async (input: { user_id?: number; email?: string; username?: string }) => {
        let query = db.selectFrom("users");
        // .innerJoin("verification_code as vc", "vc.user_id", "users.user_id");

        if (input.user_id) query = query.where("user_id", "=", input.user_id);
        else if (input.email) query = query.where("email", "=", input.email);
        else if (input.username) query = query.where("username", "=", input.username);
        query = query.where("deleted", "=", flag.FALSE);

        const result = await query.selectAll().executeTakeFirst();
        return result ?? null;
    };

    deleteUser = async (user_id: number) => {
        const transaction = await db.transaction().execute(async (trx) => {
            // Hard delete related tables

            await trx.deleteFrom("alerts_setting").where("user_id", "=", user_id).execute();
            await trx.deleteFrom("verification_code").where("user_id", "=", user_id).execute();
            // Hard delete user
            const query = await trx
                .deleteFrom("users")
                .where("user_id", "=", user_id)
                .returningAll()
                .executeTakeFirst();
            return query ?? null;
        });
        return transaction;
    };
}
