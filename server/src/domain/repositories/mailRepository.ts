import { db } from "@/config/db";
import { Mail } from "@/entities";
import { IMailRepository } from "@/interfaces";

export class MailRepository implements IMailRepository {
  async getMailFormat(id: number): Promise<Mail> {
    const query = db.selectFrom("mail").where("id", "=", id).selectAll();
    const result = await query.executeTakeFirstOrThrow();
    return result;
  }
}
