import { Route } from "@/config/constant/types";
import { StatisticController } from "@/domain/controllers/statisticController";
import { StatisticInteractor } from "@/domain/interactors";
import { StatisticRepository } from "@/domain/repositories";
import { StatisticValidationMiddleware } from "../middlewares/statisticValidation.middleware";

const statisticRepository = new StatisticRepository();
const statisticInteractor = new StatisticInteractor(statisticRepository);
const statisticController = new StatisticController(statisticInteractor);
const statisticValidation = new StatisticValidationMiddleware();

const statisticRouter: Route[] = [
    {
        path: "/statistics/district/:district_id",
        method: "GET",
        controller: statisticController.onGetByDistrictID.bind(statisticController),
        role: "user",
        middleware: [statisticValidation.validateGetByDistrictID],
    },
    {
        path: "/statistics/district/:district_id/history",
        method: "GET",
        controller: statisticController.onGetDistrictHistory.bind(statisticController),
        role: "user",
        middleware: [statisticValidation.validateGetDistrictHistory],
    },
    {
        path: "/statistics/ranking",
        method: "GET",
        controller: statisticController.onGetRankByDate.bind(statisticController),
        role: "user",
        middleware: [statisticValidation.validateGetRankByDate],
    },
    {
        path: "/statistics/time-list",
        method: "GET",
        controller: statisticController.onGetTimeList.bind(statisticController),
        role: "",
    },
    {
        path: "/statistics/average/:province_id",
        method: "GET",
        controller: statisticController.onGetAQIStatisticsByProvince.bind(statisticController),
        role: "",
        middleware: [statisticValidation.validateGetAQIStatisticsByProvince],
    },
];

export default statisticRouter;
