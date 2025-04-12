import { createUserSchema, signInSchema } from "../validations/userValidation";
import { validateRequest } from "./validationMiddleware";

export class UserValidationMiddleware {
    validateCreateUser = validateRequest({
        body: createUserSchema.body,
    });

    validateSignin = validateRequest({
        body: signInSchema.body,
    });
}
