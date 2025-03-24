import { db } from "@/config/db";
import { WindData } from "@/entities/WindData";
import { IWindDataRepository } from "@/interfaces";

export class WindDataRepository implements IWindDataRepository {
  async getWindData(timestamp: Date): Promise<WindData | null> {
    const query = await db
      .selectFrom("wind_data")
      .selectAll()
      .where("timestamp", "=", timestamp)
      .executeTakeFirst();
    return query ?? null;
  }
}
