import { Validator } from "@/services/validateService";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

type ValidationTarget = "body" | "query" | "params";
type ValidationSchemaConfig = {
    [key in ValidationTarget]?: ZodSchema;
};

export const validateRequest = (schemas: ValidationSchemaConfig) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            for (const [target, schema] of Object.entries(schemas)) {
                if (schema) {
                    const validator = new Validator(schema);
                    const targetData = req[target as ValidationTarget];
                    try {
                        validator.validate(targetData);
                    } catch (error) {
                        if (error instanceof ZodError) {
                            const formattedErrors = error.format();

                            res.status(400).json({
                                status: "error",
                                message: "Validation failed",
                                errors: formattedErrors,
                            });
                            return;
                        }
                        throw error;
                    }
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
