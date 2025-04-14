import { Route } from "@/config/constant";
import { WindDataController } from "../controllers";
import { WindDataInteractor } from "../interactors";
import { WindDataRepository } from "../repositories";

const windDataRepository = new WindDataRepository();
const windDataInteractor = new WindDataInteractor(windDataRepository);
const windDataController = new WindDataController(windDataInteractor);

const windDataRoute: Route[] = [
    {
        path: "/wind-data",
        controller: windDataController.onGetWindData.bind(windDataController),
        method: "GET",
        role: "",
    },
];

export default windDataRoute;
