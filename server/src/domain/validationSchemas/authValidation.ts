import { z } from "zod";

export const refreshTokenSchema = {
	headers: z.object({
		authorization: z.string().min(1, "Authorization header is required"),
	}),
};

export const verifyCodeSchema = {
	params: z.object({
		code: z.string().min(1, "Verification code is required"),
	}),
};

export const signInSchema = {
	body: z.object({
		accountIdentifier: z.string(),
		password: z.string(),
	}),
};
