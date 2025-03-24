import { db } from "@/config/db";
import { CronjobMonitor } from "@/entities";
import { ICronjobMonitorRepository } from "@/interfaces";

export class CronjobMonitorRepository implements ICronjobMonitorRepository {
  async getCronjobRecord(timestamp: Date): Promise<CronjobMonitor | null> {
    const record = await db
      .selectFrom("cronjob_monitor")
      .selectAll()
      .where("timestamp", "=", timestamp)
      .executeTakeFirst();

    return record ?? null;
  }

  async createNewCronjobRecord(payload: Omit<CronjobMonitor, "id">): Promise<CronjobMonitor> {
    const newRecord = await db
      .insertInto("cronjob_monitor")
      .values(payload)
      .returningAll()
      .executeTakeFirstOrThrow();

    return newRecord;
  }

  async updateCronjobRecord(
    payload: Partial<CronjobMonitor> & { id: number }
  ): Promise<CronjobMonitor> {
    const updatedRecord = await db
      .updateTable("cronjob_monitor")
      .set(payload)
      .where("id", "=", payload.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedRecord;
  }
}
