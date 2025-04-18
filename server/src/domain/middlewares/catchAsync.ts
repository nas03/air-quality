import { NextFunction, Request, Response } from "express";

export const catchAsync =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            return res.status(500).json({
                status: "error",
                message: (error as Error).message,
            });
        });
    };
