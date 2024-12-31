export interface IValidationService<T> {
  validate(data: unknown): T;
  isValid(data: unknown): Promise<boolean>;
}
