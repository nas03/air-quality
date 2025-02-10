import { Route } from "@/config/constant/types";
import { NotificationController } from "@/domain/controllers";
import { UserNotificationInteractor } from "@/domain/interactors";

const userNotificationInteractor = new UserNotificationInteractor();
const userNotificationController = new NotificationController(userNotificationInteractor);

const notificationRouter: Route[] = [
  {
    path: "/notification/send-mail",
    controller: userNotificationController.onSendMail.bind(userNotificationController),
    method: "POST",
    role: "",
  },
  {
    path: "/notification",
    controller: userNotificationController.onCreateNotification.bind(userNotificationController),
    method: "POST",
    role: "",
  },
  {
    path: "/notification/:user_id",
    controller: userNotificationController.onGetUserNotification.bind(userNotificationController),
    method: "GET",
    role: "",
  },
];

export default notificationRouter;
