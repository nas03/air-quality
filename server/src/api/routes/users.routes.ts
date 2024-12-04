import { use } from "@/helpers/utils/utils";
import { Router } from "express";
import { usersController } from "../controller";

const usersRoutes = Router();

usersRoutes.post("/users/create", use(usersController.createUser));

export default usersRoutes;
