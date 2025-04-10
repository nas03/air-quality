import { db } from "@/config/db";
import { CronjobMonitor } from "@/entities";
import { ICronjobMonitorRepository } from "@/interfaces";
import { sql } from "kysely";

export class CronjobMonitorRepository implements ICronjobMonitorRepository {
    async getCronjobRecord(date: string): Promise<CronjobMonitor | null> {
        const record = await db
            .selectFrom("cronjob_monitor")
            .selectAll()
            .where((eb) =>
                eb.and([
                    eb(
                        sql`EXTRACT(YEAR FROM timestamp)`,
                        "=",
                        sql`EXTRACT(YEAR FROM date(${date}))`,
                    ),
                    eb(
                        sql`EXTRACT(MONTH FROM timestamp)`,
                        "=",
                        sql`EXTRACT(MONTH FROM date(${date}))`,
                    ),
                    eb(sql`EXTRACT(DAY FROM timestamp)`, "=", sql`EXTRACT(DAY FROM date(${date}))`),
                ]),
            )
            .orderBy("timestamp", "desc")
            .executeTakeFirst();

        return record ?? null;
    }

    async getAllCronjobRecords() {
        const records = await db
            .selectFrom("cronjob_monitor")
            .selectAll()
            .orderBy("timestamp", "desc")
            .limit(30)
            .execute();
        return records;
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
        payload: Partial<CronjobMonitor> & { id: number },
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
