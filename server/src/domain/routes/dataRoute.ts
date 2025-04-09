import { Route } from "@/config/constant";
import multer from "multer";
import { DataController } from "../controllers";

// Use memory storage instead of disk storage for S3 uploads
const upload = multer({ storage: multer.memoryStorage() });

const dataController = new DataController();

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
    method: "GET",
    controller: dataController.onGetObject,
    middleware: [],
    role: "",
  },
  {
    path: "/files/:filename",
    method: "DELETE",
    controller: dataController.onDeleteObject,
    middleware: [],
    role: "",
  },
];

export default dataRoute