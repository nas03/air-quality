import { BaseController } from "@/domain/controllers/baseController";
import { DataInteractor } from "@/domain/interactors/dataInteractor";
import { Request, Response } from "express";

export class DataController extends BaseController<DataInteractor> {
  onGetData = async (req: Request, res: Response) => {
    const data = await this.interactor.getImage("f");
    if (!data) return null;
  };
  // res.setHeader('Content-Type', 'application/octet-stream');
}
