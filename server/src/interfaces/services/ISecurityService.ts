export interface ISecurityService {
  encryptString(input: string): Promise<string>;
  //   decrypt(input: string): Promise<string>;
  compareString(input: string, hashedString: string): Promise<boolean>;
  createToken(input: object, expiredIn?: string): Promise<string>;
  decodeToken<T>(input: string): T;
  verifyToken(input: string): number;
}
