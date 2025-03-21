import { Route } from "@/config/constant";
import { UserSettingController } from "../controllers";
import { UserSettingInteractor } from "../interactors";
import { UserSettingRepository } from "../repositories";

const userSettingRepository = new UserSettingRepository();
const userSettingInteractor = new UserSettingInteractor(userSettingRepository);
const userSettingController = new UserSettingController(userSettingInteractor);

const userSettingRouter: Route[] = [
  {
    path: "/user/:user_id/settings",
    controller: userSettingController.onGetUserSetting.bind(userSettingController),
    method: "GET",
    role: "user",
  },
  {
    path: "/user/settings",
    controller: userSettingController.onCreateUserSetting.bind(userSettingController),
    method: "POST",
    role: "user",
  },
];

export default userSettingRouter;
