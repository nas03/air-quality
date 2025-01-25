import { emailRegex } from "@/config/constant";
import { UserRepository } from "@/domain/repositories";
import { User } from "@/entities";
import { IUserInteractor } from "@/interfaces";
import { CacheService } from "@/services";

export class UserInteractor implements IUserInteractor {
  private userRepository: UserRepository;
  private cacheService: CacheService;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.cacheService = new CacheService();
  }

  findUser = async (accountIdentifier: unknown): Promise<User | null> => {
    let searchKey = "";
    switch (typeof accountIdentifier) {
      case "number":
        searchKey = "user_id";
        break;
      case "string":
        searchKey = emailRegex.test(accountIdentifier) ? "email" : "username";
        break;
    }
    let hashKey = ["users", searchKey, String(accountIdentifier)].join(":");

    const cache = await this.cacheService.get<User | null>(hashKey);
    if (cache) return cache;

    let data: Awaited<User | null> = null;
    data = await this.userRepository.findUser({ [searchKey]: accountIdentifier });
    if (data) await this.cacheService.set(hashKey, data);
    return data;
  };

  createUser = async (input: User): Promise<Pick<User, "user_id" | "username"> | null> => {
    const data = await this.userRepository.createUser(input);
    return data;
  };

  deleteUser = async (user_id: number): Promise<User | null> => {
    const data = await this.userRepository.deleteUser(user_id);
    if (!data) {
      return null;
    }

    const hashKeyUserId = ["users", "user_id", String(user_id)].join(":");
    const hashKeyUsername = ["users", "username", String(data?.username)].join(":");
    const hashKeyEmail = ["users", "email", String(data?.email)].join(":");
    await Promise.all([
      this.cacheService.delete(hashKeyUserId),
      this.cacheService.delete(hashKeyUsername),
      this.cacheService.delete(hashKeyEmail),
    ]);

    return data;
  };
}
