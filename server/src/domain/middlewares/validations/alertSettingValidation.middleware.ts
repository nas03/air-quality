import {
    onCreateAlertSettingSchema,
    onDeleteAlertSettingById,
    onGetAlertSettingByUser,
    onGetUserAlertByDistrict,
    onGetWeatherDataByLocation,
    onUpdateAlertSetting,
} from "@/domain/validationSchemas/alertSettingValidation";
import { validateRequest } from "./validationMiddleware";

export class AlertSettingValidationMiddleware {
    // Alert settings endpoint
    validateAlertSettings = validateRequest({
        POST: {
            body: onCreateAlertSettingSchema.body,
        },
        GET: {
            params: onGetAlertSettingByUser.params,
        },
    });

    // Individual alert setting endpoint
    validateAlertSettingById = validateRequest({
        PUT: {
            params: onUpdateAlertSetting.params,
            body: onUpdateAlertSetting.body,
        },
        DELETE: {
            params: onDeleteAlertSettingById.params,
        },
    });

    // For backward compatibility
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
        query: onGetUserAlertByDistrict.query,
    });

    validateGetWeatherDataByLocation = validateRequest({
        query: onGetWeatherDataByLocation.query,
    });
}
