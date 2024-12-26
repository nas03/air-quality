import { IValidator } from "@/interfaces/common";

export class ValidatorFactory<T> {
	private validator: IValidator<T>;

	constructor(validator: IValidator<T>) {
		this.validator = validator;
	}

	setValidator(validator: IValidator<T>) {
		this.validator = validator;
	}

	validate(data: unknown): T {
		return this.validator.validate(data);
	}

	isValid(data: unknown): boolean {
		return this.validator.isValid(data);
	}
}
