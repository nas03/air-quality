import { use } from "@/helpers/utils/utils";
import { Router } from "express";
import { usersController } from "../controller";

const usersRoutes = Router();

usersRoutes.post("/users/create", use(usersController.createUser));
usersRoutes.post("/users/signin", use(usersController.signIn));
usersRoutes.post("/users/signout", use(usersController.signOut));
usersRoutes.post("/users/refresh", use(usersController.refreshToken));

export default usersRoutes;
