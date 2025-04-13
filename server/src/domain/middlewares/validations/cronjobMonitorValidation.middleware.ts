import {
    createCronjobRecordSchema,
    getCronjobRecordSchema,
    updateCronjobRecordSchema,
} from "@/domain/validationSchemas/cronjobMonitorValidation";
import { validateRequest } from "./validationMiddleware";

export class CronjobMonitorValidationMiddleware {
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
