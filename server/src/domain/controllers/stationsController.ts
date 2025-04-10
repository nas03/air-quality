import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { StationsInteractor } from "@/domain/interactors";
import { Request, Response } from "express";

export class StationsController extends BaseController<[StationsInteractor]> {
    private stationInteractor = this.interactors[0];
    onGetStationByID = async (req: Request, res: Response) => {
        const station_id = req.params["station_id"];
        const query = req.query as unknown as {
            date: Date;
        };
        const data = await this.stationInteractor.getStationByID(station_id, query.date);
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: data,
        });
    };

    onGetAllStations = async (req: Request, res: Response) => {
        const query = req.query as unknown as {
            date: Date;
        };
        const data = await this.stationInteractor.getAllStations(query.date);
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: data,
        });
    };
}
