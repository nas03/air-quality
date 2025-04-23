export interface IMailService {
	sendMail(mailOptions: { to: string; subject: string; html?: string }): Promise<boolean>;
}
