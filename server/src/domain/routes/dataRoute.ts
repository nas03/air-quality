import type { Route } from "@/config/constant";
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
// const dataValidationMiddleware = new DataValidationMiddleware();

const dataRoute: Route[] = [
	{
		path: "/files",
		method: "POST",
		controller: dataController.onPutObject,
		middleware: [upload.single("file") /* dataValidationMiddleware.validatePutObject */],
		role: "",
	},
	{
		path: "/files/batch-download",
		method: "GET",
		controller: dataController.onBatchDownload,
		middleware: [
			/* dataValidationMiddleware.validateBatchDownload */
		],
		role: "",
	},

	{
		path: "/files/download-date",
		method: "GET",
		controller: dataController.onDownloadByDate,
		middleware: [
			/* dataValidationMiddleware.validateDownloadByDate */
		],
		role: "",
	},
	{
		path: "/files/:filename",
		method: "DELETE",
		controller: dataController.onDeleteObject,
		middleware: [
			/* dataValidationMiddleware.validateDeleteObject */
		],
		role: "",
	},
	{
		path: "/files/geoserver",
		method: "GET",
		controller: dataController.onGetObjectURL.bind(dataController),
		role: "",
	},
];

export default dataRoute;
