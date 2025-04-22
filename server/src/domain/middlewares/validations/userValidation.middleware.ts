import { createUserSchema } from "../../validationSchemas/userValidation";
import { validateRequest } from "./validationMiddleware";

export class UserValidationMiddleware {
    // Method-based validation for user routes
    validateUser = validateRequest({
        POST: {
            body: createUserSchema.body,
        },
    });

    // For backward compatibility
    validateCreateUser = validateRequest({
        body: createUserSchema.body,
    });
}
