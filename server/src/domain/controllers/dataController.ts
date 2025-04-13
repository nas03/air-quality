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

    onDeleteObject = async (req: Request, res: Response) => {
        const { filename } = req.params;

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
