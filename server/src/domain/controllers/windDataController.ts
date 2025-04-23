import { resMessage, statusCode } from "@/config/constant";
import type { Request, Response } from "express";
import type { WindDataInteractor } from "../interactors";
import { BaseController } from "./baseController";

export class WindDataController extends BaseController<[WindDataInteractor]> {
	private windDataInteractor = this.interactors[0];
	onGetWindData = async (req: Request, res: Response) => {
		const { timestamp } = req.query;
		if (!timestamp) {
			return res.status(statusCode.BAD_REQUEST).json({
				status: "fail",
				message: resMessage.field_invalid,
			});
		}
		const date = new Date(timestamp.toString());
		const data = await this.windDataInteractor.getWindData(date);
		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: data,
		});
	};
}
