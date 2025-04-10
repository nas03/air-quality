import { Route } from "@/config/constant/types";
import { CronjobMonitorController } from "@/domain/controllers";
import { CronjobMonitorInteractor } from "@/domain/interactors";
import { CronjobMonitorRepository } from "@/domain/repositories";
import { CronjobMonitorMiddleware } from "../middlewares/cronjob.middleware";

// Create instances in the correct order
const cronjobMonitorRepository = new CronjobMonitorRepository();
const cronjobMonitorInteractor = new CronjobMonitorInteractor(cronjobMonitorRepository);
const cronjobMonitorController = new CronjobMonitorController(cronjobMonitorInteractor);
const cronjobMonitorMiddleware = new CronjobMonitorMiddleware();
const cronjobMonitorRoute: Route[] = [
    {
        path: "/cronjob/record",
        method: "GET",
        controller: cronjobMonitorController.onGetCronjobRecord.bind(cronjobMonitorController),
        role: "",
    },
    {
        path: "/cronjob/record/all",
        method: "GET",
        controller: cronjobMonitorController.onGetAllCronjobRecords.bind(cronjobMonitorController),
        role: "",
    },
    {
        path: "/cronjob/record",
        method: "POST",
        controller: cronjobMonitorController.onCreateCronjobRecord.bind(cronjobMonitorController),
        role: "",
    },
    {
        path: "/cronjob/record/:id",
        method: "PUT",
        controller: cronjobMonitorController.onUpdateCronjobRecord.bind(cronjobMonitorController),
        role: "",
    },
    {
        path: "/cronjob/rerun",
        method: "POST",
        controller: cronjobMonitorController.onRerunCronjob.bind(cronjobMonitorController),
        role: "",
        middleware: [cronjobMonitorMiddleware.rerunCronjobMiddleware],
    },
];

export default cronjobMonitorRoute;
