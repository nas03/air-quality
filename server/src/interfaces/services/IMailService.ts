export interface IMailService {
  sendMail(from: string, to: string, title: string, content: string): Promise<boolean>;
}
