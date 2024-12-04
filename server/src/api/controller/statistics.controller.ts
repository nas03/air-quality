import { zodParse } from "@/helpers/utils/utils";
import { statisticsRepository } from "@/repositories";
import { Request, Response } from "express";
import z from "zod";

const getByDistrictID = async (req: Request, res: Response) => {
  try {
    const schema = z.object({ district_id: z.string(), time: z.coerce.date().optional() });
    const data = await zodParse(schema, { ...req.query, ...req.params });
    if (!data) {
      return res.status(400).json({
        status: "fail",
        message: "Fields are invalid",
        data: null,
      });
    }

    const queryResult = await statisticsRepository.getByDistrictID(data.district_id, data.time);
    return res.status(200).json({
      status: "success",
      data: queryResult,
    });
  } catch (error) {
    console.log("Error fetching by district_id", error);
    return res.status(500).json({
      data: null,
      status: "error",
      message: "Server error",
    });
  }
};

const getDistrictHistory = async (req: Request, res: Response) => {
  try {
    const schema = z.object({ district_id: z.string(), start_date: z.coerce.date(), end_date: z.coerce.date() });
    const query = await zodParse(schema, { ...req.query, ...req.params });
    if (!query) {
      return res.status(400).json({
        status: "fail",
        message: "Fields are invalid",
        data: null,
      });
    }
    const data = await statisticsRepository.getDistrictHistory(query.district_id, query.start_date, query.end_date);
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log("Error fetching by date", error);
    return res.status(500).json({
      data: null,
      status: "error",
      message: "Server error",
    });
  }
};

const getRankByDate = async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      time: z.coerce.date(),
    });
    const query = await zodParse(schema, req.query);
    if (!query) {
      return res.status(400).json({
        status: "fail",
        message: "Fields are invalid",
        data: null,
      });
    }
    const data = await statisticsRepository.getRankByDate(query.time);
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log("Error fetching by date", error);
    return res.status(500).json({
      data: null,
      status: "error",
      message: "Server error",
    });
  }
};
export { getByDistrictID, getDistrictHistory, getRankByDate };
