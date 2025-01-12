import { db } from "@/config/db";
import { Stations } from "@/entities/Stations";
import { IStationsRepository } from "@/interfaces/repositories/IStationsRepository";

export class StationsRepository implements IStationsRepository {
  async getAllStations(date?: Date): Promise<Stations[]> {
    let query = db.selectFrom("stations");
    if (date) query = query.where("timestamp", "=", date);
    const result = await query.selectAll().execute();
    return result;
  }

  async getStationByID(station_id: string, date?: Date): Promise<Stations | null> {
    let query = db.selectFrom("stations").where("station_id", "=", station_id);
    if (date) query = query.where("timestamp", "=", date);
    const result = await query.selectAll().executeTakeFirst();
    return result ?? null;
  }
}
