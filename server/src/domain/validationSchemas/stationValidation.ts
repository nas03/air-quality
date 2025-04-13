import z from "zod";
import { dateTransformer } from "./common";

export const onGetStationByID = {
    params: z.object({ station_id: z.string() }),
    query: z.object({
        date: z
            .string()
            .transform(dateTransformer)
            .refine((val) => val !== undefined, {
                error: "Date is undefined",
            }),
    }),
};

export const onGetAllStations = {
    query: z.object({
        date: z
            .string()
            .transform(dateTransformer)
            .refine((val) => val !== undefined, {
                error: "Date is undefined",
            }),
    }),
};
