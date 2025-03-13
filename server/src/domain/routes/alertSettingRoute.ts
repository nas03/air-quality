import { Route } from "@/config/constant";
import { AlertSettingController } from "../controllers";
import { AlertSettingInteractor, DistrictInteractor } from "../interactors";
import { AlertSettingRepository, DistrictRepository } from "../repositories";

const alertSettingRepository = new AlertSettingRepository();
const alertSettingInteractor = new AlertSettingInteractor(alertSettingRepository);
const districtRepository = new DistrictRepository();
const districtInteractor = new DistrictInteractor(districtRepository);

const alertSettingController = new AlertSettingController(
  alertSettingInteractor,
  districtInteractor
);

const alertSettingRouter: Route[] = [
  {
    path: "/user/:user_id/alert-settings",
    controller: alertSettingController.onGetAlertSettingByUser.bind(alertSettingController),
    method: "GET",
    role: "user",
  },
  {
    path: "/alert-settings",
    controller: alertSettingController.onCreateAlertSetting.bind(alertSettingController),
    method: "POST",
    role: "user",
  },
  {
    path: "/alert-settings/:id",
    controller: alertSettingController.onUpdateAlertSetting.bind(alertSettingController),
    method: "PUT",
    role: "user",
  },
  {
    path: "/alert-settings/:id",
    controller: alertSettingController.onDeleteAlertSettingById.bind(alertSettingController),
    method: "DELETE",
    role: "user",
  },
  {
    path: "/alert-settings/user/:user_id",
    controller: alertSettingController.onGetUserAlertByDistrict.bind(alertSettingController),
    method: "GET",
    role: "user",
  },
  {
    path: "/alert-settings/district/:district_id",
    controller: alertSettingController.onGetWeatherDataByDistrict.bind(alertSettingController),
    method: "GET",
    role: "",
  },
];

export default alertSettingRouter;
