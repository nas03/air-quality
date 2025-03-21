import { BaseController } from "@/domain/controllers/baseController";
import { StatisticInteractor } from "@/domain/interactors";
import { Request, Response } from "express";

export class StatisticController extends BaseController<[StatisticInteractor]> {
  private statisticInteractor = this.interactors[0];
  onGetByDistrictID = async (req: Request, res: Response) => {
    const params = req.params as {
      district_id: string;
    };
    const queries = req.query as unknown as {
      date?: Date;
    };
    const data = await this.statisticInteractor.getByDistrictID(
      params["district_id"],
      queries.date
    );
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

    const data = await this.statisticInteractor.getDistrictHistory(
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
    const data = await this.statisticInteractor.getRankByDate(queries.date);
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
    const params = req.params as {
      province_id: string;
    };
    const queries = req.query as unknown as {
      start_date: Date;
      end_date: Date;
    };

    const { districtsData, provinceData } =
      await this.statisticInteractor.getAQIStatisticsByProvince(
        params.province_id,
        queries.start_date,
        queries.end_date
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
