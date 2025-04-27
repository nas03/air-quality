import { db } from "@/config/db";
import type { WindData } from "@/entities/WindData";
import type { IWindDataRepository } from "@/interfaces";
import type moment from "moment";

export class WindDataRepository implements IWindDataRepository {
	async getWindData(timestamp: Date): Promise<WindData | null> {
		const query = await db
			.selectFrom("wind_data")
			.selectAll()
			.where("timestamp", "=", timestamp)
			.executeTakeFirst();
		console.log({ query });
		return query ?? null;
	}

	getWindDataHistory = async (start_date: moment.Moment, end_date: moment.Moment) => {
		const query = await db
			.selectFrom("wind_data")
			.selectAll()
			.where((eb) => eb.between("timestamp", start_date.toDate(), end_date.toDate()))
			.execute();
		return query;
	};
}
