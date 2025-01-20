import { AUTHENTICATION } from "@/config/constant";
import { ISecurityService } from "@/interfaces/services/ISecurityService";
import argon from "argon2";
import jwt from "jsonwebtoken";

export class SecurityService implements ISecurityService {
  async encryptString(input: string): Promise<string> {
    const result = await argon.hash(input);
    return result;
  }

  async compareString(input: string, hashedString: string): Promise<boolean> {
    const result = await argon.verify(hashedString, input);
    return result;
  }

  async createToken(payload: object, expiredIn?: string): Promise<string> {
    return jwt.sign(payload, String(process.env.JWT_SECRET), expiredIn ? { expiresIn: expiredIn } : undefined);
  }

  decodeToken<T>(input: string): T {
    const parsedToken = jwt.verify(input, String(process.env.JWT_SECRET));
    return parsedToken as T;
  }

  verifyToken(input: string): number {
    try {
      jwt.verify(input, String(process.env.JWT_SECRET));
      return AUTHENTICATION.TOKEN_VERIFICATION.VALID;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          return AUTHENTICATION.TOKEN_VERIFICATION.EXPIRED;
        }
      }
      return AUTHENTICATION.TOKEN_VERIFICATION.INVALID;
    }
  }
}
