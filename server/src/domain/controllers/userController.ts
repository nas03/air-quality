import { AUTHENTICATION, resMessage, statusCode } from "@/config/constant";
import { emailVerificationTemplate } from "@/config/mailTemplate";
import { BaseController } from "@/domain/controllers/baseController";
import { UserInteractor, VerificationCodeInteractor } from "@/domain/interactors";
import { MailService, SecurityService } from "@/services";
import { Request, Response } from "express";

export class UserController extends BaseController<[UserInteractor, VerificationCodeInteractor]> {
    private readonly userInteractor = this.interactors[0];
    private readonly verificationCodeInteractor = this.interactors[1];
    private readonly mailService: MailService;

    constructor(...interactors: [UserInteractor, VerificationCodeInteractor]) {
        super(...interactors);
        this.mailService = new MailService();
    }
    
    onCreateUser = async (req: Request, res: Response) => {
        const body = req.body as {
            username: string;
            password: string;
            phone_number: string;
            email: string;
        };

        const isUserExists = await this.userInteractor.findUser(body.username);
        if (isUserExists?.user_id) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.user_existed,
                data: null,
            });
        }

        const hashedPassword = await new SecurityService().encryptString(body.password);
        const newUser = await this.userInteractor.createUser({
            username: body.username,
            phone_number: body.phone_number,
            email: body.email,
            password: hashedPassword,
            role: AUTHENTICATION.USER_ROLE.USER,
        });

        if (!newUser)
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: "Error creating new user",
            });

        const verificationCode = await this.verificationCodeInteractor.createVerificationCode(
            newUser.user_id
        );
        const FE_URL = "http://localhost:5173/email-verification";
        await this.mailService.sendMail({
            to: newUser.email,
            subject: "Xác nhận Email",
            html: emailVerificationTemplate(
                `${FE_URL}?code=${verificationCode?.code}`,
                newUser.email
            ),
        });
        return res.status(200).json({
            status: "success",
            data: {
                user_id: newUser.user_id,
                username: newUser.username,
            },
        });
    };

    onUpdateUserBasicData = async (req: Request, res: Response) => {
        const { user_id, username, phone_number } = req.body;
        let payload = {};
        if (username) payload["username"] = username;
        if (phone_number) payload["phone_number"] = phone_number;
        if (!user_id) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });
        }
        const updateUser = await this.userInteractor.updateUser(user_id, payload);
        if (!updateUser)
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: resMessage.server_error,
                data: null,
            });
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: null,
        });
    };

    onUpdateUserPassword = async (req: Request, res: Response) => {
        const { user_id, old_password, new_password } = req.body;
        if (!user_id || !old_password || !new_password)
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });
        const user = await this.userInteractor.findUser(Number(user_id));
        if (!user)
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });
        const validateOldPassword = await new SecurityService().compareString(
            old_password,
            user.password
        );
        if (!validateOldPassword) {
            return res.status(statusCode.ERROR).json({
                status: "error",
                message: resMessage.wrong_old_password,
                data: null,
            });
        }
        const hashedPassword = await new SecurityService().encryptString(new_password);
        await this.userInteractor.updateUser(user_id, { password: hashedPassword });
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: null,
        });
    };

    onGetUserInfo = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        if (!user_id)
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });

        const userInfo = await this.userInteractor.findUser(Number(user_id));

        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: userInfo,
        });
    };

    onDeleteUser = async (req: Request, res: Response) => {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(statusCode.BAD_REQUEST).json({
                status: "fail",
                message: resMessage.field_invalid,
                data: null,
            });
        }
        const deletedUser = await this.userInteractor.deleteUser(Number(user_id));
        if (!deletedUser) {
            return res.status(statusCode.NOT_FOUND).json({
                status: "fail",
                message: resMessage.not_found || "User not found",
                data: null,
            });
        }
        return res.status(statusCode.SUCCESS).json({
            status: "success",
            data: null,
        });
    };
}
