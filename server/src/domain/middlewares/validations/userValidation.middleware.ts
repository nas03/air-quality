import { createUserSchema } from "../../validationSchemas/userValidation";
import { validateRequest } from "./validationMiddleware";

export class UserValidationMiddleware {
    validateCreateUser = validateRequest({
        body: createUserSchema.body,
    });
}
