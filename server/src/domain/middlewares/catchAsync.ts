import { NextFunction, Request, Response } from "express";

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.log("Request Body: ", req.body);
    console.log("Request Query: ", req.query);
    console.log("Request Params: ", req.params);
    console.log("Error: ", error);
    return res.status(500).json({
      status: "error",
      message: "System Error",
    });
  });
};
