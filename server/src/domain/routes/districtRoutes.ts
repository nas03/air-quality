import { Route } from "@/config/constant";
import { DistrictController } from "../controllers";
import { DistrictInteractor } from "../interactors";
import { DistrictRepository } from "../repositories";

const districtRepository = new DistrictRepository();
const districtInteractor = new DistrictInteractor(districtRepository);
const districtController = new DistrictController(districtInteractor);
const districtRouter: Route[] = [
    {
        path: "/districts",
        controller: districtController.onFindAllDistricts.bind(districtController),
        method: "GET",
        role: "",
    },
    {
        path: "/districts/:district_id",
        controller: districtController.onFindDistrictById.bind(districtController),
        method: "GET",
        role: "",
    },
];

export default districtRouter;
