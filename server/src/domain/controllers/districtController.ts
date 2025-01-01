import { statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import { DistrictInteractor } from "@/domain/interactors/districtInteractor";
import { Request, Response } from "express";

export class DistrictController extends BaseController<DistrictInteractor> {
  onGetAllDistricts = async (req: Request, res: Response) => {
    const data = await this.interactor.getAllDistrict();
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data,
    });
  };

  onFindDistrict = async (req: Request, res: Response) => {
    const params = req.params as {
      district_id: string;
    };
    const data = await this.interactor.findDistrict(params.district_id);
    return res.status(statusCode.SUCCESS).json({
      status: "success",
      data,
    });
  };
}
