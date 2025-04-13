import z from "zod";
import { dateTransformer } from "./common";

export const onPutObjectSchema = {
    body: z.object({
        filename: z.string(),
    }),
};

export const onDeleteObjectSchema = {
    params: z.object({ filename: z.string() }),
};

export const onBatchDownloadSchema = {
    query: z.object({
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
    }),
};

export const onDownloadByDateSchema = {
    query: z.object({
        date: z
            .string()
            .transform(dateTransformer)
            .refine((val) => val !== undefined, {
                message: "Valid date is required",
            }),
    }),
};
