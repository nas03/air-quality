import { VerificationCode } from "@/entities";

export interface IVerificationCodeInteractor {
  createVerificationCode(user_id: number): Promise<VerificationCode | null>;
  getVerificationCode(user_id: number): Promise<VerificationCode | null>;
  updateVerificationCodeStatus(user_id: number): Promise<VerificationCode | null>;
}
