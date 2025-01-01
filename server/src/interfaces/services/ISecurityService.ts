export interface ISecurityService {
  encryptString(input: string): Promise<string>;
  //   decrypt(input: string): Promise<string>;
  compareString(input: string, hashedString: string): Promise<boolean>;
  createToken(input: object, expiredIn?: string): Promise<string>;
  verifyToken<T>(input: string): T;
}
