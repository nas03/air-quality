import {
    getAQIStatisticsByProvinceSchema,
    getByDistrictIDSchema,
    getDistrictHistorySchema,
    getRankByDateSchema,
} from "../validations/statisticValidation";
import { validateRequest } from "./validationMiddleware";

export class StatisticValidationMiddleware {
    validateGetByDistrictID = validateRequest({
        params: getByDistrictIDSchema.params,
        query: getByDistrictIDSchema.query,
    });

    validateGetDistrictHistory = validateRequest({
        params: getDistrictHistorySchema.params,
        query: getDistrictHistorySchema.query,
    });

    validateGetRankByDate = validateRequest({
        query: getRankByDateSchema.query,
    });

    validateGetAQIStatisticsByProvince = validateRequest({
        params: getAQIStatisticsByProvinceSchema.params,
        query: getAQIStatisticsByProvinceSchema.query,
    });
}
