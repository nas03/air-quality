import type { IMailService } from "@/interfaces/services/IMailService";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL,
		pass: process.env.MAIL_PASSWORD,
	},
});
export class MailService implements IMailService {
	sendMail = async (mailOptions: {
		to: string;
		subject: string;
		html?: string;
	}): Promise<boolean> => {
		try {
			await transporter.sendMail(mailOptions);
			return true;
		} catch (error) {
			console.error("Failed to send email:", error);
			return false;
		}
	};
}
