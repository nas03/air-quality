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
    return jwt.sign(
      payload,
      String(process.env.JWT_SECRET),
      expiredIn ? { expiresIn: expiredIn } : undefined
    );
  }

  verifyToken<T>(input: string): T {
    const decodeObj = jwt.verify(input, String(process.env.JWT_SECRET));
    return decodeObj as T;
  }
}
