import { Route } from "@/config/constant";
import { MRecommendationController } from "@/domain/controllers";
import { MRecommendationInteractor } from "@/domain/interactors";
import { MRecommendationRepository } from "@/domain/repositories";

const repository = new MRecommendationRepository();
const interactor = new MRecommendationInteractor(repository);
const controller = new MRecommendationController(interactor);

const recommendationRouter: Route[] = [
  {
    path: "/recommendations",
    controller: controller.onGetAllRecommendations.bind(controller),
    role: "",
    method: "GET",
  },
];
export default recommendationRouter;
