import { VerificationCode } from "@/entities";
import { IVerificationCodeInteractor } from "@/interfaces";
import { SecurityService } from "@/services";
import { VerificationCodeRepository } from "../repositories";

export class VerificationCodeInteractor implements IVerificationCodeInteractor {
  private readonly verificationCodeRepository: VerificationCodeRepository;
  private readonly securityService: SecurityService;
  constructor(verificationCodeRepository: VerificationCodeRepository) {
    this.verificationCodeRepository = verificationCodeRepository;
    this.securityService = new SecurityService();
  }

  async updateVerificationCodeStatus(user_id: number): Promise<VerificationCode | null> {
    const data = await this.verificationCodeRepository.updateVerificationCodeStatus(user_id);
    return data;
  }

  async createVerificationCode(user_id: number): Promise<VerificationCode | null> {
    const token = await this.securityService.createToken({ user_id: Number(user_id) }, 3600);
    const tokenData = this.securityService.decodeToken<{ user_id: number }>(token);
    const payload: Omit<VerificationCode, "id"> & { created_at?: Date } = {
      code: token,
      user_id: user_id,
      created_at: tokenData.iat ? new Date(tokenData.iat * 1000) : new Date(),
      type: 0,
    };

    const data = await this.verificationCodeRepository.createVerificationCode(payload);
    return data;
  }

  async getVerificationCode(user_id: number): Promise<VerificationCode | null> {
    const data = await this.verificationCodeRepository.getVerificationCode(user_id);
    return data;
  }
}
