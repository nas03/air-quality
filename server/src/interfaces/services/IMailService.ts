export interface IMailService {
  sendMail(payload: { from: string; to: string; subject: string; html?: string }): Promise<boolean>;
}
