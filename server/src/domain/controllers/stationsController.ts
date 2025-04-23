import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import type { StationsInteractor } from "@/domain/interactors";
import type { Request, Response } from "express";
import moment from "moment";
export class StationsController extends BaseController<[StationsInteractor]> {
	private stationInteractor = this.interactors[0];

	onGetStationByID = async (req: Request, res: Response) => {
		const station_id = req.params["station_id"];
		const { date } = req.query;

		const data = await this.stationInteractor.getStationByID(
			station_id,
			moment(date as string, "YYYY-MM-DD")
				.utcOffset("+07:00")
				.toDate(),
		);
		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: data,
		});
	};

	onGetAllStations = async (req: Request, res: Response) => {
		const { date } = req.query;
		const data = await this.stationInteractor.getAllStations(
			moment(date as string, "YYYY-MM-DD")
				.utcOffset("+07:00")
				.toDate(),
		);

		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: data,
		});
	};
}
