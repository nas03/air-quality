import z from "zod";

export const getByDistrictIDSchema = z.object({ district_id: z.string(), time: z.coerce.date().optional() });
export const getDistrictHistorySchema = z.object({
  district_id: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});
export const getRankByDateSchema = z.object({ time: z.coerce.date() });
