export interface IValidator<T> {
	validate(data: unknown): T;
	isValid(data: unknown): boolean;
}
