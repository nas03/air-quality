import { IMailService } from "@/interfaces/services/IMailService";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});
export class MailService implements IMailService {
  sendMail = async (from: string, to: string, subject: string, html: string): Promise<boolean> => {
    const mailOptions = {
      to: "sonanhguyen003@gmail.com",
      subject: "Hello from Nodemailer",
      text: "This is a test email sent using Nodemailer.",
    };
    await transporter.sendMail(mailOptions);
    return true;
  };
}
