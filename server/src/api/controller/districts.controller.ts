import { resMessage, statusCode } from "@/helpers/const";
import { createResponse } from "@/helpers/utils/utils";
import { districtsRepository } from "@/repositories";
import { Request, Response } from "express";

const getAllDistricts = async (req: Request, res: Response) => {
  try {
    const data = await districtsRepository.getAllDistricts();
    return createResponse(res, statusCode.SUCCESS, "success", null, data);
  } catch (error) {
    console.log("Error get all districts", error);
    return createResponse(res, statusCode.ERROR, "error", resMessage.server_error);
  }
};

export { getAllDistricts };
