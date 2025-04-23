import {
	createCronjobRecordSchema,
	getCronjobRecordSchema,
	updateCronjobRecordSchema,
} from "@/domain/validationSchemas/cronjobMonitorValidation";
import { validateRequest } from "./validationMiddleware";

export class CronjobMonitorValidationMiddleware {
	// Combined method-based validation for cronjob record endpoint
	validateCronjobRecord = validateRequest({
		GET: {
			query: getCronjobRecordSchema.query,
		},
		POST: {
			body: createCronjobRecordSchema.body,
		},
		PUT: {
			params: updateCronjobRecordSchema.params,
			body: updateCronjobRecordSchema.body,
		},
	});

	// For backward compatibility
	validateGetCronjobRecord = validateRequest({
		query: getCronjobRecordSchema.query,
	});

	validateCreateCronjobRecord = validateRequest({
		body: createCronjobRecordSchema.body,
	});

	validateUpdateCronjobRecord = validateRequest({
		params: updateCronjobRecordSchema.params,
		body: updateCronjobRecordSchema.body,
	});
}
