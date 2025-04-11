import { Route } from "@/config/constant";
import multer from "multer";
import { DataController } from "../controllers";
import { DataInteractor } from "../interactors";
import { StationsRepository, WindDataRepository } from "../repositories";

// Use memory storage instead of disk storage for S3 uploads
const upload = multer({ storage: multer.memoryStorage() });
const windDataRepository = new WindDataRepository();
const stationRepository = new StationsRepository();
const dataInteractor = new DataInteractor(windDataRepository, stationRepository);
const dataController = new DataController(dataInteractor);

const dataRoute: Route[] = [
    {
        path: "/files",
        method: "POST",
        controller: dataController.onPutObject,
        middleware: [upload.single("file")],
        role: "",
    },

    {
        path: "/files/:filename",
        method: "DELETE",
        controller: dataController.onDeleteObject,
        middleware: [],
        role: "",
    },
    {
        path: "/files/batch-download",
        method: "GET",
        controller: dataController.onBatchDownload,
        role: "",
    },
    {
        path: "/files/download-date",
        method: "GET",
        controller: dataController.onDownloadByDate,
        role: "",
    },
];

export default dataRoute;
