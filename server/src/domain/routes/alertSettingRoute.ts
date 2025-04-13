import { Route } from "@/config/constant";
import { AlertSettingController } from "../controllers";
import { AlertSettingInteractor, DistrictInteractor, StatisticInteractor } from "../interactors";
import AlertSettingValidationMiddleware from "../middlewares/validations/alertSettingValidation.middleware";
import { AlertSettingRepository, DistrictRepository, StatisticRepository } from "../repositories";

const alertSettingRepository = new AlertSettingRepository();
const alertSettingInteractor = new AlertSettingInteractor(alertSettingRepository);
const districtRepository = new DistrictRepository();
const statisticRepository = new StatisticRepository();
const districtInteractor = new DistrictInteractor(districtRepository);
const statisticInteractor = new StatisticInteractor(statisticRepository);
const alertSettingController = new AlertSettingController(
    alertSettingInteractor,
    districtInteractor,
    statisticInteractor
);
const alertSettingValidationMiddleware = new AlertSettingValidationMiddleware();
const alertSettingRouter: Route[] = [
    {
        path: "/user/:user_id/alert-settings",
        controller: alertSettingController.onGetAlertSettingByUser.bind(alertSettingController),
        method: "GET",
        middleware: [],
        role: "user",
    },
    {
        path: "/alert-settings",
        controller: alertSettingController.onCreateAlertSetting.bind(alertSettingController),
        method: "POST",
        middleware: [alertSettingValidationMiddleware.validateCreateAlertSetting],
        role: "user",
    },
    {
        path: "/alert-settings/:id",
        controller: alertSettingController.onUpdateAlertSetting.bind(alertSettingController),
        method: "PUT",
        middleware: [alertSettingValidationMiddleware.validateUpdateAlertSetting],
        role: "user",
    },
    {
        path: "/alert-settings/:id",
        controller: alertSettingController.onDeleteAlertSettingById.bind(alertSettingController),
        method: "DELETE",
        middleware: [alertSettingValidationMiddleware.validateDeleteAlertSettingById],
        role: "user",
    },
    {
        path: "/alert-settings/user/:user_id",
        controller: alertSettingController.onGetUserAlertByDistrict.bind(alertSettingController),
        method: "GET",
        middleware: [alertSettingValidationMiddleware.validateGetUserAlertByDistrict],
        role: "user",
    },
    {
        path: "/alert-settings/location",
        controller: alertSettingController.onGetWeatherDataByLocation.bind(alertSettingController),
        method: "GET",
        middleware: [alertSettingValidationMiddleware.validateGetWeatherDataByLocation],
        role: "",
    },
    {
        path: "/send-alert",
        controller: alertSettingController.onSendUserAlert.bind(alertSettingController),
        method: "POST",
        middleware: [],
        role: "user",
    },
];

export default alertSettingRouter;
