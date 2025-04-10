import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { MRecommendationInteractor } from "@/domain/interactors";
import { Request, Response } from "express";

export class MRecommendationController extends BaseController<[MRecommendationInteractor]> {
    private mRecommendationInteractor = this.interactors[0];
    onGetAllRecommendations = async (req: Request, res: Response) => {
        const data = await this.mRecommendationInteractor.getAllRecommendations();
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: data,
        });
    };
}
