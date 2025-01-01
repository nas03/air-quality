import { IValidationService } from "@/interfaces";
import z, { infer as ZodInfer } from "zod";

export class Validator<T extends z.ZodTypeAny> implements IValidationService<T> {
  private schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  validate(data: unknown): ZodInfer<T> {
    return this.schema.parse(data);
  }

  async isValid(data: unknown): Promise<boolean> {
    try {
      this.schema.parse(data);
      return true;
    } catch {
      return false;
    }
  }
}
