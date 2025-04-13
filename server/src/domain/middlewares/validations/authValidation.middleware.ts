import { refreshTokenSchema, verifyCodeSchema } from "@/domain/validationSchemas/authValidation";
import { signInSchema } from "@/domain/validationSchemas/userValidation";
import { validateRequest } from "./validationMiddleware";

export class AuthValidationMiddleware {
    validateSignin = validateRequest({
        body: signInSchema.body,
    });

    validateRefreshToken = validateRequest({
        headers: refreshTokenSchema.headers,
    });

    validateVerifyCode = validateRequest({
        params: verifyCodeSchema.params,
    });
}
