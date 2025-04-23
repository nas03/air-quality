import z from "zod";
import { numberTransformer } from "./common";
const idSchema = z.object({
	id: z
		.string({ message: "ID is required" })
		.transform(numberTransformer)
		.refine((val) => val !== undefined, {
			message: "ID is not a number",
		}),
});

const userIdSchema = z.object({
	user_id: z
		.string({ message: "user_id is required" })
		.transform(numberTransformer)
		.refine((val) => val !== undefined, {
			message: "user_id is not in correct format",
		}),
});

export const onCreateAlertSettingSchema = {
	body: z.object({
		aqi_index: z.boolean(),
		district_id: z.string(),
		pm_25: z.boolean(),
		temperature: z.boolean(),
		user_id: z.number(),
		weather: z.boolean(),
		wind_speed: z.boolean(),
		receive_notifications: z.number(),
	}),
};

export const onUpdateAlertSetting = {
	params: idSchema,
	body: z.object({
		aqi_index: z.boolean().optional(),
		district_id: z.string().optional(),
		pm_25: z.boolean().optional(),
		temperature: z.boolean().optional(),
		weather: z.boolean().optional(),
		wind_speed: z.boolean().optional(),
		receive_notifications: z.number().optional(),
	}),
};

export const onDeleteAlertSettingById = {
	params: idSchema,
};

export const onGetAlertSettingByUser = {
	params: userIdSchema,
};

export const onGetUserAlertByDistrict = {
	params: userIdSchema,
	query: z.object({
		district_id: z.string(),
	}),
};

export const onGetWeatherDataByLocation = {
	query: z.union([
		z.object({
			district_id: z.string(),
		}),
		z.object({
			lat: z.number(),
			lon: z.number(),
		}),
	]),
};
