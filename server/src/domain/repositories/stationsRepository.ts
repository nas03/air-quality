import { db } from "@/config/db";
import { IStationsRepository } from "@/interfaces";

export class StationsRepository implements IStationsRepository {
  async getAllStations(date?: Date) {
    let query = db.selectFrom("stations");
    if (date) query = query.where("timestamp", "=", date);
    const result = await query.selectAll().execute();
    return result;
  }

  async getStationByID(station_id: string, date?: Date) {
    let query = db.selectFrom("stations").where("station_id", "=", station_id);
    if (date) query = query.where("timestamp", "=", date);
    const result = await query.selectAll().executeTakeFirst();
    return result ?? null;
  }
}
