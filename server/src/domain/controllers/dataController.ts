import { statusCode } from "@/config/constant";
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

    onDownloadByDate = async (req: Request, res: Response) => {
        const date = req.query.date as string;

        if (!date) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "error",
                message: "date parameter is required",
            });
        }

        const zip = new JSZip();

        await this.dataInteractor.getRasterDataHistory(date, date, zip);
        await this.dataInteractor.getStationDataHistory(date, date, zip);
        await this.dataInteractor.getWindDataHistory(date, date, zip);

        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        const formattedDate = date.replace(/-/g, "");

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="data_${formattedDate}.zip"`);
        res.setHeader("Content-Length", zipBuffer.length);

        return res.send(zipBuffer);
    };
}
