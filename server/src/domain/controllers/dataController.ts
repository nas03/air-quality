import { statusCode } from "@/config/constant";
import { StorageService } from "@/services";
import { Request, Response } from "express";

export class DataController {
    private readonly storageService: StorageService;
    constructor() {
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
        const { filename } = req.params;

        if (!filename) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "error",
                message: "Filename is required",
            });
        }

        const signedURL = await this.storageService.getObject(filename);

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

    onListObject = async (req: Request, res: Response) => {};
}
