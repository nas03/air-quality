import { resMessage, statusCode } from "@/config/constant";
import { StorageService } from "@/services";
import { Request, Response } from "express";
import JSZip from "jszip";
import { DataInteractor } from "../interactors";
import { BaseController } from "./baseController";

export class DataController extends BaseController<[DataInteractor]> {
    private readonly storageService: StorageService;
    private readonly dataInteractor = this.interactors[0];

    constructor(...interactors: [DataInteractor]) {
        super(...interactors);
        this.storageService = new StorageService();
    }

    onPutObject = async (req: Request, res: Response) => {
        const { filename } = req.body;
        if (!req.file) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "error",
                message: "No file provided",
            });
        }

        const file = req.file;
        const uploadResult = await this.storageService.putObject(filename, file);
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: uploadResult,
        });
    };

    onGetData = async (req: Request, res: Response) => {
        const { type } = req.query;
        if (!type || !["raster", "wind_data", "station_data"].includes(String(type))) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });
        }
        let isValid = true;
        let data: any = null;
        switch (type) {
            case "raster":
                if (!req.query.date) isValid = false;
                data = await this.dataInteractor.getRasterData(req.query.date as string);
                break;
            case "wind_data":
                if (!req.query.date) isValid = false;
                // data = await this.dataInteractor.getWindData(req.query.date as string)
                break;
            case "station_data":
                if (!req.query.date) isValid = false;
                break;
            default:
                break;
        }

        if (!isValid)
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: data,
        });
    };

    onGetObject = async (req: Request, res: Response) => {
        const { filename } = req.query;

        if (!filename) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "error",
                message: "Filename is required",
            });
        }

        const signedURL = await this.storageService.getObject(filename as string);

        if (!signedURL) {
            return res.status(statusCode.NOT_FOUND).json({
                status: "error",
                message: "File not found",
            });
        }

        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: { url: signedURL },
        });
    };

    onDeleteObject = async (req: Request, res: Response) => {
        const { filename } = req.params;

        if (!filename) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "error",
                message: "Filename is required",
            });
        }

        const result = await this.storageService.deleteObject(filename);

        return res.status(statusCode.SUCCESS).json({
            status: "success",
            message: "File deleted successfully",
            data: result,
        });
    };

    onBatchDownload = async (req: Request, res: Response) => {
        const start_date = req.query.start_date as string;
        const end_date = req.query.end_date as string;

        if (!start_date || !end_date) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "error",
                message: "start_date and end_date are required",
            });
        }

        const zip = new JSZip();

        await this.dataInteractor.getRasterDataHistory(start_date, end_date, zip);
        await this.dataInteractor.getStationDataHistory(start_date, end_date, zip);
        await this.dataInteractor.getWindDataHistory(start_date, end_date, zip);
        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="archive.zip"`);
        res.setHeader("Content-Length", zipBuffer.length);

        return res.send(zipBuffer);
    };
}
