import { Route } from "@/config/constant/types";
import { StatisticController } from "@/domain/controllers/statisticController";
import { StatisticInteractor } from "@/domain/interactors";
import { StatisticRepository } from "@/domain/repositories";

const statisticRepository = new StatisticRepository();
const statisticInteractor = new StatisticInteractor(statisticRepository);
const statisticController = new StatisticController(statisticInteractor);
// const statisticRouter = Router();

const statisticRouter: Route[] = [
  {
    path: "/statistics/district/:district_id",
    method: "GET",
    controller: statisticController.onGetByDistrictID.bind(statisticController),
    role: "user",
  },
  {
    path: "/statistics/district/:district_id/history",
    method: "GET",
    controller: statisticController.onGetDistrictHistory.bind(statisticController),
    role: "user",
  },
  {
    path: "/statistics/ranking",
    method: "GET",
    controller: statisticController.onGetRankByDate.bind(statisticController),
    role: "user",
  },
  {
    path: "/statistics/time-list",
    method: "GET",
    controller: statisticController.onGetTimeList.bind(statisticController),
    role: "",
  },
];

export default statisticRouter;
