import { Route } from "@/config/constant/type";
import { DistrictController } from "@/domain/controllers/districtController";
import { DistrictInteractor } from "@/domain/interactors/districtInteractor";
import { DistrictRepository } from "@/domain/repositories/districtRepository";

const districtRepository = new DistrictRepository();
const districtInteractor = new DistrictInteractor(districtRepository);
const districtController = new DistrictController(districtInteractor);

const districtRouter: Route[] = [
  {
    path: "/districts",
    controller: districtController.onGetAllDistricts.bind(districtController),
    method: "GET",
    role: "user",
  },
  {
    path: "/districts/:district_id",
    controller: districtController.onFindDistrict.bind(districtController),
    method: "GET",
    role: "user",
  },
];

export default districtRouter;
