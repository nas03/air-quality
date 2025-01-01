import { Route } from "@/config/constant/type";
import { DataController } from "@/domain/controllers";
import { DataInteractor } from "@/domain/interactors";

const dataInteractor = new DataInteractor();
const dataController = new DataController(dataInteractor);

const dataRouter: Route[] = [
  {
    path: "/data",
    controller: dataController.onGetData.bind(dataInteractor),
    method: "GET",
    role: "",
  },
];

export default dataRouter;
