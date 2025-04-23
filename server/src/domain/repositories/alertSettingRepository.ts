import { ACCOUNT_STATUS, flag, receiveNotification } from "@/config/constant";
import { db } from "@/config/db";
import type { AlertSetting, User } from "@/entities";
import type { IAlertSettingRepository } from "@/interfaces";

export class AlertSettingRepository implements IAlertSettingRepository {
	async getUserAlertByDistrict(district_id: string) {
		const query = await db
			.selectFrom("alerts_setting as as")
			.leftJoin("m_districts as md", "md.district_id", "as.district_id")
			.select([
				"as.id",
				"as.district_id",
				"as.aqi_index",
				"as.wind_speed",
				"as.temperature",
				"as.temperature",
				"as.user_id",
				"as.pm_25",
				"md.vn_district",
				"md.vn_province",
				"md.vn_type",
			])
			.where("as.district_id", "=", district_id)
			.where("md.deleted", "=", flag.FALSE)
			.executeTakeFirst();
		return { ...query };
	}

	async updateAlertSetting(id: number, payload: Partial<Omit<AlertSetting, "id" | "user_id">>) {
		const query = await db
			.updateTable("alerts_setting")
			.where("id", "=", id)
			.set(payload)
			.returningAll()
			.executeTakeFirst();

		return query ?? null;
	}
	async getAlertSettingByUserId(user_id: number): Promise<AlertSetting[]> {
		const query = await db
			.selectFrom("alerts_setting")
			.where("user_id", "=", user_id)
			.selectAll()
			.execute();
		return query;
	}

	async createAlertSetting(payload: Omit<AlertSetting, "id">): Promise<AlertSetting | null> {
		const query = await db
			.insertInto("alerts_setting")
			.values(payload)
			.onConflict((eb) => eb.columns(["user_id", "district_id"]).doNothing())
			.returningAll()
			.executeTakeFirst();
		return query ?? null;
	}

	async deleteAlertSettingById(id: number) {
		const result = await db
			.deleteFrom("alerts_setting")
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst();
		return result ?? null;
	}

	async getAllUserAlertSettings() {
		const usersData = await db
			.selectFrom("users as u")
			.innerJoin(
				(eb) =>
					eb.selectFrom("alerts_setting").select("user_id").groupBy("user_id").as("a"),
				(join) => join.onRef("a.user_id", "=", "u.user_id"),
			)
			.select(["u.email", "u.user_id", "u.phone_number"])
			.where("u.account_status", "=", ACCOUNT_STATUS.ACTIVATED)

			.execute();
		const userAlertSettingData = await db
			.selectFrom("alerts_setting")
			.selectAll()
			.where("receive_notifications", ">", receiveNotification.DISABLED)
			.execute();

		const userDataMap = usersData.reduce(
			(map, data) => map.set(data.user_id, data),
			new Map<number, Pick<User, "email" | "user_id" | "phone_number">>(),
		);

		const result = userAlertSettingData
			.filter((data) => userDataMap.has(data.user_id))
			.map((data) => ({
				...data,
				...usersData.find((user) => user.user_id === data.user_id),
			}));

		return result;
	}
}
