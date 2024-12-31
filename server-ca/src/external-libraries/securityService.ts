import { encryptionSalt } from "@/config/constant";
import { ISecurityService } from "@/interfaces/external-library/ISecurityService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class SecurityService implements ISecurityService {
  async encryptString(input: string): Promise<string> {
    const result = await bcrypt.hash(input, encryptionSalt.DEFAULT);
    return result;
  }

  async compareString(input: string, hashedString: string): Promise<boolean> {
    const result = await bcrypt.compare(input, hashedString);
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

  //   async decrypt(input: string): Promise<string> {
  //       return await bcrypt.decodeBase64()
  //   }
}
