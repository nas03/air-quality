import { z } from "zod";
import { dateTransformer } from "./common";

export const districtIdSchema = z.object({
	district_id: z.string().min(1, "District ID is required"),
});

export const provinceIdSchema = z.object({
	province_id: z.string().min(1, "Province ID is required"),
});

export const optionalDateSchema = z.object({
	date: z.string().transform(dateTransformer).optional(),
});

export const requiredDateSchema = z.object({
	date: z
		.string()
		.transform(dateTransformer)
		.refine((val) => val !== undefined, {
			message: "Valid date is required",
		}),
});

export const dateRangeSchema = z
	.object({
		start_date: z
			.string()
			.transform(dateTransformer)
			.refine((val) => val !== undefined, {
				message: "Valid start_date is required",
			}),
		end_date: z
			.string()
			.transform(dateTransformer)
			.refine((val) => val !== undefined, {
				message: "Valid end_date is required",
			}),
	})
	.refine(
		(data) => {
			if (data.start_date && data.end_date) {
				return data.start_date <= data.end_date;
			}
			return true;
		},
		{
			message: "End date cannot be before start date",
			path: ["end_date"],
		},
	);

export const getByDistrictIDSchema = {
	params: districtIdSchema,
	query: optionalDateSchema,
};

export const getDistrictHistorySchema = {
	params: districtIdSchema,
	query: dateRangeSchema,
};

export const getRankByDateSchema = {
	query: requiredDateSchema,
};

export const getAQIStatisticsByProvinceSchema = {
	params: provinceIdSchema,
	query: dateRangeSchema,
};
