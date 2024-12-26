import { UserSchema } from '@/entities/schema';
import { ValidatorFactory } from '@/external-libraries/validator/validatorFactory';

import { ZodValidator } from '@/external-libraries/validator/zodValidator';
import { NextFunction, Request, Response } from 'express';

export class UserMiddleware {
	public validateUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userValidator = new ValidatorFactory(
				new ZodValidator(new UserSchema().zodUserSchema)
			);
			userValidator.validate(req.body);
			next();
		} catch {
			res.status(400).json({
				status: 'fail',
				message: 'fields are not valid',
			});
		}
	};
}
