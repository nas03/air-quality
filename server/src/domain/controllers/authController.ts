import { ACCOUNT_STATUS, AUTHENTICATION, resMessage, statusCode } from "@/config/constant";
import { BaseController } from "@/domain/controllers/baseController";
import type { UserRole, UserToken } from "@/domain/controllers/types";
import type { UserInteractor, VerificationCodeInteractor } from "@/domain/interactors";
import { SecurityService } from "@/services";
import type { Request, Response } from "express";

export class AuthController extends BaseController<[UserInteractor, VerificationCodeInteractor]> {
	private securityService = new SecurityService();
	private userInteractor = this.interactors[0];
	private verificationCodeInteractor = this.interactors[1];

	// --- Private helpers ---

	private isValidUserRole = (role: UserRole | undefined): boolean => {
		const validRoles: UserRole[] = [
			AUTHENTICATION.USER_ROLE.USER,
			AUTHENTICATION.USER_ROLE.ADMIN,
		];
		return !!role && validRoles.includes(role);
	};

	// --- Controller methods ---

	onRotateRefreshToken = async (req: Request, res: Response) => {
		const refresh_token = req.headers.authorization;

		if (!refresh_token) {
			return res.status(statusCode.UNAUTHORIZED).json({
				status: "fail",
				message: "Refresh token is missing",
			});
		}

		const verify = this.securityService.verifyToken(refresh_token);

		if (verify === AUTHENTICATION.TOKEN_VERIFICATION.VALID) {
			return res.status(statusCode.SUCCESS).json({
				status: "success",
				message: "Valid Token",
			});
		}

		if (verify === AUTHENTICATION.TOKEN_VERIFICATION.INVALID) {
			return res.status(statusCode.UNAUTHORIZED).json({
				status: "fail",
				message: "Invalid token",
			});
		}

		const decodedToken = this.securityService.decodeToken<UserToken>(refresh_token);

		const [new_access_token, new_refresh_token] = [
			this.securityService.createToken({
				user_id: decodedToken?.user_id,
				username: decodedToken?.username,
				role: decodedToken?.role,
			}),
			this.securityService.createToken({
				user_id: decodedToken?.user_id,
				username: decodedToken?.username,
				role: decodedToken?.role,
			}),
		];

		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: {
				access_token: new_access_token,
				refresh_token: new_refresh_token,
			},
		});
	};

	onSignin = async (req: Request, res: Response) => {
		const securityService = new SecurityService();
		const cookies = req.cookies;

		if (
			cookies?.REFRESH_TOKEN &&
			securityService.verifyToken(cookies.REFRESH_TOKEN) ===
				AUTHENTICATION.TOKEN_VERIFICATION.VALID
		) {
			const decodedToken = securityService.decodeToken<UserToken>(cookies.REFRESH_TOKEN);
			const access_token = securityService.createToken(
				{
					user_id: decodedToken?.user_id,
					username: decodedToken?.username,
					role: decodedToken?.role,
				},
				"15m",
			);

			return res.status(statusCode.SUCCESS).json({
				status: "success",
				data: { access_token },
			});
		}

		const { accountIdentifier, password } = req.body;

		const isUserExists = await this.userInteractor.findUser(accountIdentifier);

		if (!isUserExists) {
			return res.status(statusCode.SUCCESS).json({
				status: "success",
				message: resMessage.wrong_credentials,
				data: null,
			});
		}

		if (isUserExists.account_status === ACCOUNT_STATUS.NOT_ACTIVATED) {
			return res.status(statusCode.SUCCESS).json({
				status: "success",
				message: "Người dùng chưa kích hoạt tài khoản",
				data: null,
			});
		}

		const validatePassword = await securityService.compareString(
			password,
			isUserExists.password,
		);

		if (!validatePassword) {
			return res.status(statusCode.SUCCESS).json({
				status: "success",
				message: resMessage.wrong_credentials,
				data: null,
			});
		}

		const [access_token, refresh_token] = await Promise.all([
			securityService.createToken(
				{
					user_id: isUserExists.user_id,
					username: isUserExists.username,
					role: AUTHENTICATION.USER_ROLE.USER,
				},
				"15m",
			),
			securityService.createToken(
				{
					user_id: isUserExists.user_id,
					username: isUserExists.username,
					role: AUTHENTICATION.USER_ROLE.USER,
				},
				"30d",
			),
		]);

		res.cookie("AUTH_REF_TOKEN", refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: {
				user_id: isUserExists.user_id,
				username: isUserExists.username,
				access_token,
			},
		});
	};

	onVerifyVerificationCode = async (req: Request, res: Response) => {
		const { code } = req.params;
		const decodeCode = this.securityService.decodeToken<{ user_id: number }>(code);
		const verificationCode = await this.verificationCodeInteractor.getVerificationCode(
			decodeCode.user_id,
		);

		if (verificationCode?.code !== code) {
			return res.status(statusCode.UNAUTHORIZED).json({
				status: "fail",
				message: "Not authorized",
				data: null,
			});
		}

		await Promise.all([
			this.userInteractor.updateUser(decodeCode.user_id, { account_status: 1 }),
			this.verificationCodeInteractor.updateVerificationCodeStatus(decodeCode.user_id),
		]);

		return res.status(statusCode.SUCCESS).json({
			status: "success",
			data: true,
		});
	};

	onVerifyAdmin = async (req: Request, res: Response) => {
		const { access_token } = req.body;
		const verify = this.securityService.verifyToken(access_token);

		if (verify === AUTHENTICATION.TOKEN_VERIFICATION.VALID) {
			const decodeToken = this.securityService.decodeToken<UserToken>(access_token);
			if (decodeToken.role === AUTHENTICATION.USER_ROLE.ADMIN) {
				return res.status(statusCode.SUCCESS).json({
					status: "success",
					data: null,
				});
			}
		}

		return res.status(statusCode.UNAUTHORIZED).json({
			status: "fail",
			message: "Invalid token",
		});
	};

	onVerifyUser = async (req: Request, res: Response) => {
		const { access_token } = req.body;
		const verify = this.securityService.verifyToken(access_token);

		if (verify === AUTHENTICATION.TOKEN_VERIFICATION.VALID) {
			const decodeToken = this.securityService.decodeToken<UserToken>(access_token);

			if (this.isValidUserRole(decodeToken.role)) {
				return res.status(statusCode.SUCCESS).json({
					status: "success",
					data: null,
				});
			}
		}

		return res.status(statusCode.UNAUTHORIZED).json({
			status: "fail",
			message: "Invalid token",
		});
	};
}
