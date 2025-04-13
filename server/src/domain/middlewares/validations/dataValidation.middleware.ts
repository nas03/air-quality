import {
    onBatchDownloadSchema,
    onDeleteObjectSchema,
    onDownloadByDateSchema,
    onPutObjectSchema,
} from "@/domain/validationSchemas/dataValidation";
import { validateRequest } from "./validationMiddleware";

export class DataValidationMiddleware {
    validatePutObject = validateRequest({
        body: onPutObjectSchema.body,
    });

    validateDeleteObject = validateRequest({
        params: onDeleteObjectSchema.params,
    });

    validateBatchDownload = validateRequest({
        query: onBatchDownloadSchema.query,
    });

    validateDownloadByDate = validateRequest({
        query: onDownloadByDateSchema.query,
    });
}
