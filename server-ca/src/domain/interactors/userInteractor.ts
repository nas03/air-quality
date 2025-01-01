import { emailRegex } from "@/config/constant/regex";
import { UserRepository } from "@/domain/repositories";
import { User } from "@/entities";
import { CacheService } from "@/external-libraries/cacheService";
import { IUserInteractor } from "@/interfaces";

export class UserInteractor implements IUserInteractor {
  private userRepository: UserRepository;
  private cacheService = new CacheService();
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  findUser = async (accountIdentifier: unknown): Promise<User | null> => {
    let hashKey = `user:${accountIdentifier}`;
    const cache = await this.cacheService.get<User | null>(hashKey);
    if (cache) {
      return cache;
    }
    let data: Awaited<User | null> = null;
    if (typeof accountIdentifier === "number") {
      data = await this.userRepository.findUser({ user_id: accountIdentifier });
    } else if (typeof accountIdentifier === "string") {
      const searchKey = emailRegex.test(accountIdentifier) ? "email" : "username";
      data = await this.userRepository.findUser({ [searchKey]: accountIdentifier });
    }

    if (data) await this.cacheService.set(hashKey, data, 3600);
    return data;
  };

  createUser = async (input: User): Promise<Pick<User, "user_id" | "username"> | null> => {
    const data = await this.userRepository.createUser(input);
    return data;
  };

  deleteUser = async (user_id: number): Promise<User | null> => {
    throw new Error("Method is not implemented");
  };
}
