import { NextFunction, Request, Response } from "express";

export type Route = {
  path: string;
  method: string;
  role: string;
  controller: (req: Request, res: Response) => Promise<Response>;
  middleware?: ((req: Request, res: Response, next: NextFunction) => void | Promise<void>)[];
};
