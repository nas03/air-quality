export interface INotificationInteractor {
  sendNotificationToAll(): Promise<boolean>;
  sendNotificationTo(user_id: number): Promise<boolean>;
}
