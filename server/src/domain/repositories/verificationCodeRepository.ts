import { db } from "@/config/db";
import { VerificationCode } from "@/entities";
import { IVerificationCodeRepository } from "@/interfaces";

export class VerificationCodeRepository implements IVerificationCodeRepository {
  async createVerificationCode(
    payload: Omit<VerificationCode, "id"> & { created_at?: Date }
  ): Promise<VerificationCode | null> {
    const query = await db
      .insertInto("verification_code")
      .values(payload)
      .returningAll()
      .executeTakeFirst();
    return query ?? null;
  }

  async getVerificationCode(user_id: number): Promise<VerificationCode | null> {
    const query = await db
      .selectFrom("verification_code")
      .selectAll()
      .where("user_id", "=", user_id)
      .orderBy("created_at desc")
      .limit(1)
      .executeTakeFirst();
    return query ?? null;
  }

  async updateVerificationCodeStatus(user_id: number): Promise<VerificationCode | null> {
    const latestCode = await db
      .selectFrom("verification_code")
      .selectAll()
      .where("user_id", "=", user_id)
      .orderBy("id desc")
      .limit(1)
      .where("activate_status", "=", 0)
      .executeTakeFirst();
    if (!latestCode) return null;
    const query = await db
      .updateTable("verification_code")
      .where("user_id", "=", user_id)
      .where("id", "=", latestCode.id)
      .set("activate_status", 1)
      .returningAll()
      .executeTakeFirst();
    return query ?? null;
  }
}
