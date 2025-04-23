import {
	getAQIStatisticsByProvinceSchema,
	getByDistrictIDSchema,
	getDistrictHistorySchema,
	getRankByDateSchema,
} from "@/domain/validationSchemas/statisticValidation";
import { validateRequest } from "./validationMiddleware";

export class StatisticValidationMiddleware {
	// Method-specific validations for district statistics
	validateDistrictStatistics = validateRequest({
		GET: {
			params: getByDistrictIDSchema.params,
			query: getByDistrictIDSchema.query,
		},
	});

	validateDistrictHistory = validateRequest({
		GET: {
			params: getDistrictHistorySchema.params,
			query: getDistrictHistorySchema.query,
		},
	});

	validateRanking = validateRequest({
		GET: {
			query: getRankByDateSchema.query,
		},
	});

	validateProvinceStatistics = validateRequest({
		GET: {
			params: getAQIStatisticsByProvinceSchema.params,
			query: getAQIStatisticsByProvinceSchema.query,
		},
	});

	// For backward compatibility
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
