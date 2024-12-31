import { emailRegex } from "@/config/constant/regex";
import { UserRepository } from "@/domain/repositories";
import { User } from "@/entities";
import { IUserInteractor } from "@/interfaces";

export class UserInteractor implements IUserInteractor {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  findUser = async (accountIdentifier: unknown): Promise<User | null> => {
    let data: Awaited<User | null> = null;

    if (typeof accountIdentifier === "number") {
      data = await this.userRepository.findUser({ user_id: accountIdentifier });
    } else if (typeof accountIdentifier === "string") {
      const searchKey = emailRegex.test(accountIdentifier) ? "email" : "username";
      data = await this.userRepository.findUser({ [searchKey]: accountIdentifier });
    }

    return data;
  };

  createUser = async (input: User): Promise<User | null> => {
    const data = await this.userRepository.createUser(input);
    return data;
  };

  deleteUser = async (user_id: number): Promise<User | null> => {
    throw new Error("Method is not implemented");
  };
}
