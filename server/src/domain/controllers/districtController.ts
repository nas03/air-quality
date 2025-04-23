import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import type { DistrictInteractor } from "@/domain/interactors";
import type { Request, Response } from "express";

export class DistrictController extends BaseController<[DistrictInteractor]> {
	private districtInteractor = this.interactors[0];

	onFindAllDistricts = async (req: Request, res: Response) => {
		const data = await this.districtInteractor.getAllDistrict();
		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data,
		});
	};

	onFindDistrictById = async (req: Request, res: Response) => {
		const { district_id } = req.params;

		const data = await this.districtInteractor.findDistrict(district_id);
		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data,
		});
	};
}
