import { BaseController } from "@/domain/controllers/baseController";
import { StatisticInteractor } from "@/domain/interactors";
import { Request, Response } from "express";

export class StatisticController extends BaseController<StatisticInteractor> {
  onGetByDistrictID = async (req: Request, res: Response) => {
    const params = req.params as {
      district_id: string;
    };
    const queries = req.query as unknown as {
      date?: Date;
    };
    const data = await this.interactor.getByDistrictID(params["district_id"], queries.date);
    return res.status(200).json({
      status: "success",
      data,
    });
  };

  onGetDistrictHistory = async (req: Request, res: Response) => {
    const params = req.params as {
      district_id: string;
    };
    const queries = req.query as unknown as {
      start_date: Date;
      end_date: Date;
    };

    const data = await this.interactor.getDistrictHistory(
      params.district_id,
      queries.start_date,
      queries.end_date
    );
    return res.status(200).json({
      status: "success",
      data,
    });
  };

  onGetRankByDate = async (req: Request, res: Response) => {
    const queries = req.query as unknown as {
      date: Date;
    };
    const data = await this.interactor.getRankByDate(queries.date);
    return res.status(200).json({
      status: "success",
      data,
    });
  };
}
