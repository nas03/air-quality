import { Route } from "@/config/constant";
import { MRecommendationController } from "@/domain/controllers";
import { MRecommendationInteractor } from "@/domain/interactors";
import { MRecommendationRepository } from "@/domain/repositories";

const mRecommendationRepository = new MRecommendationRepository();
const mRecommendationInteractor = new MRecommendationInteractor(mRecommendationRepository);
const mRecommendationController = new MRecommendationController(mRecommendationInteractor);

const recommendationRouter: Route[] = [
    {
        path: "/recommendations",
        controller: mRecommendationController.onGetAllRecommendation.bind(mRecommendationController),
        role: "",
        method: "GET",
    },
];
export default recommendationRouter;
