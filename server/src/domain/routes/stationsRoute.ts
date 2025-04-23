import type { Route } from "@/config/constant/types";
import { StationsController } from "@/domain/controllers/stationsController";
import { StationsInteractor } from "@/domain/interactors/stationsInteractor";
import { StationsRepository } from "@/domain/repositories/stationsRepository";

const stationsRepository = new StationsRepository();
const stationsInteractor = new StationsInteractor(stationsRepository);
const stationsController = new StationsController(stationsInteractor);

const stationsRouter: Route[] = [
	{
		path: "/stations",
		controller: stationsController.onGetAllStations.bind(stationsController),
		method: "GET",
		role: "",
	},
	{
		path: "/stations/:station_id",
		controller: stationsController.onGetStationByID.bind(stationsController),
		method: "GET",
		role: "",
	},
];

export default stationsRouter;
