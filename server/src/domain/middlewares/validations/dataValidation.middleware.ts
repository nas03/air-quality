import {
    onBatchDownloadSchema,
    onDeleteObjectSchema,
    onDownloadByDateSchema,
    onPutObjectSchema,
} from "@/domain/validationSchemas/dataValidation";
import { validateRequest } from "./validationMiddleware";

export class DataValidationMiddleware {
    validateObject = validateRequest({
        PUT: {
            body: onPutObjectSchema.body,
        },
        DELETE: {
            params: onDeleteObjectSchema.params,
        },
    });

    validateDownload = validateRequest({
        GET: {
            query: onBatchDownloadSchema.query,
        },
    });

    validateDownloadByDate = validateRequest({
        GET: {
            query: onDownloadByDateSchema.query,
        },
    });

    validatePutObject = validateRequest({
        body: onPutObjectSchema.body,
    });

    validateDeleteObject = validateRequest({
        params: onDeleteObjectSchema.params,
    });

    validateBatchDownload = validateRequest({
        query: onBatchDownloadSchema.query,
    });
}
