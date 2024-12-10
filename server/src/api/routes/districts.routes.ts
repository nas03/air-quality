import { use } from "@/helpers/utils/utils";
import { Router } from "express";
import { districtsController } from "../controller";

const districtsRoute = Router();

districtsRoute.get("/districts/all", use(districtsController.getAllDistricts));

export default districtsRoute;
