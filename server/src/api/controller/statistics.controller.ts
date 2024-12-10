import { resMessage, statusCode } from "@/helpers/const";
import { createResponse, validate } from "@/helpers/utils/utils";
import { statisticsRepository } from "@/repositories";
import { Request, Response } from "express";
import { getByDistrictIDSchema, getDistrictHistorySchema, getRankByDateSchema } from "./schema/statistics.schema";

const getByDistrictID = async (req: Request, res: Response) => {
  try {
    const data = await validate(getByDistrictIDSchema, { ...req.query, ...req.params });
    if (!data) {
      return createResponse(res, statusCode.BAD_REQUEST, "fail", resMessage.field_invalid, null);
    }
    const queryResult = await statisticsRepository.getByDistrictID(data.district_id, data.time);
    return createResponse(res, statusCode.SUCCESS, "success", null, queryResult);
  } catch (error) {
    console.log("Error fetching by district_id", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};

const getDistrictHistory = async (req: Request, res: Response) => {
  try {
    const query = await validate(getDistrictHistorySchema, { ...req.query, ...req.params });
    if (!query) {
      return createResponse(res, statusCode.BAD_REQUEST, "fail", resMessage.field_invalid, null);
    }
    const data = await statisticsRepository.getDistrictHistory(query.district_id, query.start_date, query.end_date);
    return createResponse(res, statusCode.SUCCESS, "success", null, data);
  } catch (error) {
    console.log("Error fetching by date", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};

const getRankByDate = async (req: Request, res: Response) => {
  try {
    const query = await validate(getRankByDateSchema, req.query);
    if (!query) {
      return createResponse(res, statusCode.BAD_REQUEST, "fail", resMessage.field_invalid, null);
    }

    const data = await statisticsRepository.getRankByDate(new Date("2024-11-14"));
    return createResponse(res, statusCode.SUCCESS, "success", null, data);
  } catch (error) {
    console.log("Error fetching by date", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error, null);
  }
};
export { getByDistrictID, getDistrictHistory, getRankByDate };
