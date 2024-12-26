import { IValidator } from '@/interfaces/common';
import { ZodTypeAny } from 'zod';

export class ZodValidator<T extends ZodTypeAny> implements IValidator<T> {
	private schema: T;

	constructor(schema: T) {
		this.schema = schema;
	}

	validate(data: unknown): T {
		return this.schema.parse(data) as T;
	}

	isValid(data: unknown): boolean {
		try {
			this.schema.parse(data);
			return true;
		} catch {
			return false;
		}
	}
}
