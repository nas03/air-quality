import z, { infer as ZodInfer } from "zod";
export interface IValidationService<T extends z.ZodTypeAny> {
    validate(data: unknown): ZodInfer<T>;
    isValid(data: unknown): Promise<boolean>;
    validateAsync(data: unknown): Promise<ZodInfer<T>>;
}
