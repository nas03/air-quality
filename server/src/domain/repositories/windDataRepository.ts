import { db } from "@/config/db";
import type { WindData } from "@/entities/WindData";
import type { IWindDataRepository } from "@/interfaces";
import type moment from "moment";

export class WindDataRepository implements IWindDataRepository {
	async getWindData(timestamp: Date): Promise<WindData | null> {
		const startOfDay = new Date(timestamp);
		startOfDay.setHours(7, 0, 0, 0);

		const endOfDay = new Date(timestamp);
		endOfDay.setDate(endOfDay.getDate() + 1);
		endOfDay.setHours(7, 0, 0, 0);

		const query = await db
			.selectFrom("wind_data")
			.selectAll()
			.where((eb) => eb.between("timestamp", startOfDay, endOfDay))
			.orderBy("timestamp", "desc")
			.limit(1)
			.executeTakeFirst();

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
