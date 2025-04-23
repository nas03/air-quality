import type { NextFunction, Request, Response } from "express";

export class CronjobMonitorMiddleware {
	rerunCronjobMiddleware = async (req: Request, res: Response, next: NextFunction) => {
		req.setTimeout(300000);
		next();
	};
}
