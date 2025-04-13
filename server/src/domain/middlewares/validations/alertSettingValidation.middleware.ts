import {
    onCreateAlertSettingSchema,
    onDeleteAlertSettingById,
    onGetAlertSettingByUser,
    onGetUserAlertByDistrict,
    onGetWeatherDataByLocation,
    onUpdateAlertSetting,
} from "@/domain/validationSchemas/alertSettingValidation";
import { validateRequest } from "./validationMiddleware";

export default class AlertSettingValidationMiddleware {
    validateCreateAlertSetting = validateRequest({
        body: onCreateAlertSettingSchema.body,
    });

    validateUpdateAlertSetting = validateRequest({
        params: onUpdateAlertSetting.params,
        body: onUpdateAlertSetting.body,
    });

    validateDeleteAlertSettingById = validateRequest({
        params: onDeleteAlertSettingById.params,
    });

    validateGetAlertSettingByUser = validateRequest({
        params: onGetAlertSettingByUser.params,
    });

    validateGetUserAlertByDistrict = validateRequest({
        // params: onGetUserAlertByDistrict.params,
        query: onGetUserAlertByDistrict.query,
    });

    validateGetWeatherDataByLocation = validateRequest({
        query: onGetWeatherDataByLocation.query,
    });
}
