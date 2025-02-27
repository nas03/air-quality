import { emailRegex } from "@/config/constant";
import { USER_KEY } from "@/config/redisKeys";
import { UserRepository } from "@/domain/repositories";
import { User } from "@/entities";
import { IUserInteractor } from "@/interfaces";
import { CacheService } from "@/services";

type SearchCriteria = {
  key: "user_id" | "email" | "username";
  redisKey: string;
};

export class UserInteractor implements IUserInteractor {
  private readonly cacheService: CacheService;
  private readonly userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.cacheService = new CacheService();
    this.userRepository = userRepository;
  }

  private getSearchCriteria(identifier: string | number): SearchCriteria {
    if (typeof identifier === "number") {
      return {
        key: "user_id",
        redisKey: USER_KEY.USERID_KEY(identifier),
      };
    }

    const isEmail = emailRegex.test(identifier);
    return {
      key: isEmail ? "email" : "username",
      redisKey: isEmail ? USER_KEY.EMAIL_KEY(identifier) : USER_KEY.USERNAME_KEY(identifier),
    };
  }

  private async invalidateUserCache(user: User): Promise<void> {
    const keysToDelete = [
      USER_KEY.EMAIL_KEY(user.email),
      USER_KEY.USERID_KEY(user.user_id),
      USER_KEY.USERNAME_KEY(user.username),
    ];
    await Promise.all(keysToDelete.map((key) => this.cacheService.delete(key)));
  }

  findUser = async (accountIdentifier: string | number): Promise<User | null> => {
    const { key, redisKey } = this.getSearchCriteria(accountIdentifier);
    return this.cacheService.cache(redisKey, () =>
      this.userRepository.findUser({ [key]: accountIdentifier })
    );
  };

  createUser = async (input: Omit<User, "user_id">): Promise<User | null> => {
    return this.userRepository.createUser(input);
  };

  deleteUser = async (user_id: number): Promise<User | null> => {
    const user = await this.userRepository.deleteUser(user_id);
    if (!user) return null;

    await this.invalidateUserCache(user);
    return user;
  };

  updateUser = async (
    user_id: number,
    payload: Partial<Omit<User, "user_id" | "role">>
  ): Promise<User | null> => {
    const user = await this.userRepository.updateUser(user_id, payload);
    if (!user) return null;
    await this.invalidateUserCache(user);
    return user;
  };
}
