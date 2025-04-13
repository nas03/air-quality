import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { DistrictInteractor } from "@/domain/interactors";
import { Request, Response } from "express";

export class DistrictController extends BaseController<[DistrictInteractor]> {
    private districtInteractor = this.interactors[0];

    onGetAllDistricts = async (req: Request, res: Response) => {
        const data = await this.districtInteractor.getAllDistrict();
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data,
        });
    };

    onFindDistrict = async (req: Request, res: Response) => {
        const { district_id } = req.params;

        const data = await this.districtInteractor.findDistrict(district_id);
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data,
        });
    };
}
