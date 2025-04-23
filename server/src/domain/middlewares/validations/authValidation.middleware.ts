import { refreshTokenSchema, verifyCodeSchema } from "@/domain/validationSchemas/authValidation";
import { signInSchema } from "@/domain/validationSchemas/userValidation";
import { validateRequest } from "./validationMiddleware";

export class AuthValidationMiddleware {
	// Method-based validations for authentication routes
	validateAuth = validateRequest({
		POST: {
			body: signInSchema.body,
		},
	});

	validateToken = validateRequest({
		POST: {
			headers: refreshTokenSchema.headers,
		},
	});

	validateCode = validateRequest({
		POST: {
			params: verifyCodeSchema.params,
		},
	});

	// For backward compatibility
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
