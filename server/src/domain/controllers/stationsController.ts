import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { StationsInteractor } from "@/domain/interactors/stationsInteractor";
import { Request, Response } from "express";

export class StationsController extends BaseController<StationsInteractor> {
  onGetStationByID = async (req: Request, res: Response) => {
    const station_id = req.params["station_id"];
    const query = req.query as unknown as {
      date: Date;
    };
    const data = await this.interactor.getStationByID(station_id, query.date);
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: data,
    });
  };

  onGetAllStations = async (req: Request, res: Response) => {
    const query = req.query as unknown as {
      date: Date;
    };
    const data = await this.interactor.getAllStations(query.date);
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data: data,
    });
  };
}
