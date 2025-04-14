import { Validator } from "@/services/validateService";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

type ValidationTarget = "body" | "query" | "params" | "headers";
type ValidationSchemaConfig = {
    [key in ValidationTarget]?: ZodSchema;
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
type MethodValidationConfig = {
    [key in HttpMethod]?: ValidationSchemaConfig;
};

export const validateRequest = (schemas: ValidationSchemaConfig | MethodValidationConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Determine if we're dealing with method-specific schemas
            const isMethodBased = Object.keys(schemas).some(key => 
                ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"].includes(key));

            // Get the appropriate schema for this request
            let schemaToUse: ValidationSchemaConfig = {};
            
            if (isMethodBased) {
                // If method-based, get schema for current HTTP method
                const method = req.method as HttpMethod;
                schemaToUse = (schemas as MethodValidationConfig)[method] || {};
            } else {
                // If not method-based, use the schema directly
                schemaToUse = schemas as ValidationSchemaConfig;
            }

            // Validate using the selected schema
            for (const [target, schema] of Object.entries(schemaToUse)) {
                if (!schema) continue;

                const targetData = req[target as ValidationTarget];

                console.log(`Validating ${target}:`, targetData);

                try {
                    const validator = new Validator(schema);
                    await validator.validateAsync(targetData);
                } catch (error) {
                    console.error(`Validation error in ${target}:`, error);

                    if (error instanceof ZodError) {
                        const formattedErrors = error.format();
                        return res.status(400).json({
                            status: "error",
                            message: `Validation failed for ${target}`,
                            errors: formattedErrors,
                        });
                    }
                    throw error;
                }
            }
            next();
        } catch (error) {
            console.error("Unexpected validation error:", error);
            next(error);
        }
    };
};
