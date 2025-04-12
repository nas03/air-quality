import { BaseController } from "@/domain/controllers/baseController";
import { StatisticInteractor } from "@/domain/interactors";
import { Request, Response } from "express";

export class StatisticController extends BaseController<[StatisticInteractor]> {
    private statisticInteractor = this.interactors[0];

    onGetByDistrictID = async (req: Request, res: Response) => {
        const { district_id } = req.params;
        const date = req.query.date as unknown as Date | undefined;

        const data = await this.statisticInteractor.getByDistrictID(district_id, date);
        return res.status(200).json({
            status: "success",
            data,
        });
    };

    onGetDistrictHistory = async (req: Request, res: Response) => {
        const { district_id } = req.params;
        const start_date = req.query.start_date as unknown as Date;
        const end_date = req.query.end_date as unknown as Date;

        const data = await this.statisticInteractor.getDistrictHistory(
            district_id,
            start_date,
            end_date
        );
        return res.status(200).json({
            status: "success",
            data,
        });
    };

    onGetRankByDate = async (req: Request, res: Response) => {
        const date = req.query.date as unknown as Date;
        const data = await this.statisticInteractor.getRankByDate(date);
        return res.status(200).json({
            status: "success",
            data,
        });
    };

    onGetTimeList = async (req: Request, res: Response) => {
        const data = await this.statisticInteractor.getTimeList();
        const result = data.map((el) => el.time);
        return res.status(200).json({
            status: "success",
            data: result,
        });
    };

    onGetAQIStatisticsByProvince = async (req: Request, res: Response) => {
        const { province_id } = req.params;
        const start_date = req.query.start_date as unknown as Date;
        const end_date = req.query.end_date as unknown as Date;

        const { districtsData, provinceData } =
            await this.statisticInteractor.getAQIStatisticsByProvince(
                province_id,
                start_date,
                end_date
            );
        return res.status(200).json({
            status: "success",
            data: {
                districtsData,
                provinceData,
            },
        });
    };
}
