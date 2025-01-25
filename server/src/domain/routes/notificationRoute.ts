import { Route } from "@/config/constant/type";
import { NotificationController } from "@/domain/controllers";
import { NotificationInteractor } from "@/domain/interactors";
import { Router } from "express";

const router = Router();
const notificationInteractor = new NotificationInteractor();
const notificationController = new NotificationController(notificationInteractor);

const notificationRouter: Route[] = [
  {
    path: "/notification/send-mail",
    controller: notificationController.onSendMail.bind(notificationController),
    method: "POST",
    role: "",
  },
];

export default notificationRouter;
