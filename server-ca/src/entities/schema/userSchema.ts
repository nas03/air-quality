import z from 'zod';
export class UserSchema {
	constructor() {}
	public readonly zodUserSchema = z.object({
		username: z.string(),
		password: z.string(),
		email: z.string().email(),
		phone_number: z.string(),
	});
}
