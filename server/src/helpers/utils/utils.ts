import childProcess from "child_process";
import { NextFunction, Request, Response } from "express";
import { infer as ZodInfer, ZodSchema } from "zod";
export const executeCommand = async (command: string): Promise<boolean> => {
  try {
    const process = childProcess.exec(command);
    await new Promise((resolve) => {
      process.on("close", resolve);
    });
    return true;
  } catch (error) {
    console.log("Error executing command", error);
    return false;
  }
};

export const zodParse = async <T extends ZodSchema>(schema: T, data: object): Promise<ZodInfer<T> | null> => {
  const query = await schema.spa(data);
  if (!query.success) {
    return null;
  }
  return query.data;
};

export const use = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
