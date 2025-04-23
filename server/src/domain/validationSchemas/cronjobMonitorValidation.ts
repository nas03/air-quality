import { z } from "zod";
import { dateTransformer } from "./common";

export const getCronjobRecordSchema = {
	query: z.object({
		date: z
			.string()
			.transform(dateTransformer)
			.refine((val) => val !== undefined, {
				message: "Valid start_date is required",
			}),
	}),
};

export const createCronjobRecordSchema = {
	body: z.object({
		timestamp: z.string().min(1, "Timestamp is required"),
		status: z.string().optional(),
		message: z.string().optional(),
		execution_time: z.number().optional(),
	}),
};

export const updateCronjobRecordSchema = {
	params: z.object({
		id: z.string().min(1, "ID is required"),
	}),
	body: z
		.object({
			timestamp: z.string().optional(),
			status: z.string().optional(),
			message: z.string().optional(),
			execution_time: z.number().optional(),
		})
		.refine((data) => Object.keys(data).length > 0, {
			message: "At least one field to update must be provided",
		}),
};
