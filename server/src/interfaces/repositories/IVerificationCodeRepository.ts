import { VerificationCode } from "@/entities";

export interface IVerificationCodeRepository {
  createVerificationCode(payload: Omit<VerificationCode, "id"> & { created_at?: Date }): Promise<VerificationCode | null>;
  getVerificationCode(user_id: number): Promise<VerificationCode | null>;
}
