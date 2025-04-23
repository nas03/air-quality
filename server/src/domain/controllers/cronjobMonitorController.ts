import { resMessage, statusCode } from "@/config/constant";
import type { CronjobMonitor } from "@/entities";
import axios from "axios";
import type { Request, Response } from "express";
import type { CronjobMonitorInteractor } from "../interactors";
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

		if (Number.isNaN(date.getTime())) {
			return res.status(statusCode.BAD_REQUEST).json({
				status: "fail",
				message: "Invalid date format",
				data: null,
			});
		}

		try {
			const record = await this.cronjobMonitorInteractor.getCronjobRecord(dateStr);

			return res.status(statusCode.SUCCESS).json({
				status: "success",
				data: record,
			});
		} catch (error) {
			if ((error as Error).message?.includes("not found")) {
				return res.status(statusCode.NOT_FOUND).json({
					status: "fail",
					message: (error as Error).message,
					data: null,
				});
			}

			return res.status(statusCode.ERROR).json({
				status: "error",
				message: (error as Error).message || resMessage.server_error,
				data: null,
			});
		}
	};

	onGetAllCronjobRecords = async (req: Request, res: Response) => {
		const { start_date, end_date } = req.query as unknown as {
			start_date: Date;
			end_date: Date;
		};

		const data = await this.cronjobMonitorInteractor.getAllCronjobRecords({
			start_date: start_date,
			end_date: end_date,
		});
		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: data,
		});
	};

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
		} catch (error) {
			return res.status(statusCode.ERROR).json({
				status: "error",
				message: (error as Error).message || resMessage.server_error,
				data: null,
			});
		}
	};

	/**
	 * Update an existing cronjob monitor record
	 */
	onUpdateCronjobRecord = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id, 10);

		if (Number.isNaN(id)) {
			return res.status(statusCode.BAD_REQUEST).json({
				status: "fail",
				message: resMessage.field_invalid,
				data: null,
			});
		}

		const payload = { ...req.body, id } as Partial<CronjobMonitor> & {
			id: number;
		};

		try {
			const updatedRecord = await this.cronjobMonitorInteractor.updateCronjobRecord(payload);

			return res.status(statusCode.SUCCESS).json({
				status: "success",
				data: updatedRecord,
			});
		} catch (error) {
			return res.status(statusCode.ERROR).json({
				status: "error",
				message: (error as Error).message || resMessage.server_error,
				data: null,
			});
		}
	};

	onRerunCronjob = async (req: Request, res: Response) => {
		try {
			const TIMEOUT = 300000; // 5 minutes
			// const controller = new AbortController();
			// const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

			const request = await axios.post("http://13.213.59.37:5000/execute-cron", {
				timeout: TIMEOUT, // Add axios timeout
			});

			// clearTimeout(timeoutId);

			const result = request.data;
			return res.status(statusCode.SUCCESS).json({
				status: "success",
				data: result,
			});
		} catch (error) {
			if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
				return res.status(statusCode.ERROR).json({
					status: "error",
					message: "Request timed out after 5 minutes",
					data: null,
				});
			}

			return res.status(statusCode.ERROR).json({
				status: "error",
				message: (error as Error).message || resMessage.server_error,
				data: null,
			});
		}
	};
}
