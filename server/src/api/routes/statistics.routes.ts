import { use } from "@/helpers/utils/utils";
import { Router } from "express";
import { statisticsController } from "../controller";
const statisticsRoute = Router();

statisticsRoute.get("/statistics/district/:district_id", use(statisticsController.getByDistrictID));
statisticsRoute.get("/statistics/history/:district_id", use(statisticsController.getByDate));

export default statisticsRoute;
