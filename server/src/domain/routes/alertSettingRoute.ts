import { Route } from "@/config/constant";
import { AlertSettingController } from "../controllers";
import { AlertSettingInteractor } from "../interactors";
import { AlertSettingRepository } from "../repositories";

const alertSettingRepository = new AlertSettingRepository();
const alertSettingInteractor = new AlertSettingInteractor(alertSettingRepository);
const alertSettingController = new AlertSettingController(alertSettingInteractor);

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
    path: "/alert-settings/:user_id",
    controller: alertSettingController.onGetUserAlertByDistrict.bind(alertSettingController),
    method: "GET",
    role: "user",
  },
];

export default alertSettingRouter;
