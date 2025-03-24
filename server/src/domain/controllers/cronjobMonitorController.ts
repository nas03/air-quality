import { resMessage, statusCode } from "@/config/constant";
import { CronjobMonitor } from "@/entities";
import { Request, Response } from "express";
import { CronjobMonitorInteractor } from "../interactors";
import { BaseController } from "./baseController";

export class CronjobMonitorController extends BaseController<[CronjobMonitorInteractor]> {
  private cronjobMonitorInteractor = this.interactors[0];

  /**
   * Get a cronjob monitor record by timestamp
   */
  onGetCronjobRecord = async (req: Request, res: Response) => {
    const dateStr = req.query.date as string;

    if (!dateStr) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.field_invalid,
        data: null,
      });
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: "Invalid date format",
        data: null,
      });
    }

    try {
      const record = await this.cronjobMonitorInteractor.getCronjobRecord(date);

      return res.status(statusCode.SUCCESS).json({
        status: "success",
        data: record,
      });
    } catch (error: any) {
      if (error.message?.includes("not found")) {
        return res.status(statusCode.NOT_FOUND).json({
          status: "fail",
          message: error.message,
          data: null,
        });
      }

      return res.status(statusCode.ERROR).json({
        status: "error",
        message: error.message || resMessage.server_error,
        data: null,
      });
    }
  };

  /**
   * Create a new cronjob monitor record
   */
  onCreateCronjobRecord = async (req: Request, res: Response) => {
    const payload = req.body as Omit<CronjobMonitor, "id">;

    if (!payload.timestamp) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.field_invalid,
        data: null,
      });
    }

    try {
      const newRecord = await this.cronjobMonitorInteractor.createNewCronjobRecord(payload);

      return res.status(statusCode.SUCCESS).json({
        status: "success",
        data: newRecord,
      });
    } catch (error: any) {
      return res.status(statusCode.ERROR).json({
        status: "error",
        message: error.message || resMessage.server_error,
        data: null,
      });
    }
  };

  /**
   * Update an existing cronjob monitor record
   */
  onUpdateCronjobRecord = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(statusCode.BAD_REQUEST).json({
        status: "fail",
        message: resMessage.field_invalid,
        data: null,
      });
    }

    const payload = { ...req.body, id } as Partial<CronjobMonitor> & { id: number };

    try {
      const updatedRecord = await this.cronjobMonitorInteractor.updateCronjobRecord(payload);

      return res.status(statusCode.SUCCESS).json({
        status: "success",
        data: updatedRecord,
      });
    } catch (error: any) {
      return res.status(statusCode.ERROR).json({
        status: "error",
        message: error.message || resMessage.server_error,
        data: null,
      });
    }
  };
}
