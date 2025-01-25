import { IMailService } from "@/interfaces/services/IMailService";
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
  sendMail = async (payload: { from: string; to: string; subject: string; html?: string }): Promise<boolean> => {
    try {
      const mailOptions = {
        to: "sonanhnguyen003@gmail.com",
        subject: "Hello from Nodemailer",
        text: "This is a test email sent using Nodemailer.",
      };
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  };
}
