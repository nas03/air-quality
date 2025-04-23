import { db } from "@/config/db";
import type { IStationsRepository } from "@/interfaces";

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

	getStationDataHistory = async (start_date: moment.Moment, end_date: moment.Moment) => {
		const query = await db
			.selectFrom("stations")
			.select([
				"id",
				"station_id",
				"station_name",
				"aqi_index",
				"pm25",
				"status",
				"timestamp",
				"address",
			])
			.where((eb) => eb.between("timestamp", start_date.toDate(), end_date.toDate()))
			.orderBy("timestamp", "asc")
			.execute();
		return query;
	};
}
