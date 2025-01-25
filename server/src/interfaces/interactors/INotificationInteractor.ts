export interface INotificationInteractor {
  sendEmailNotification(filter: { email_notification: boolean; sms_notification: boolean });
  // sendNotificationTo(user_id: number): Promise<boolean>;
}
