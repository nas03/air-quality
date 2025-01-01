import { User } from "@/entities";

export interface IUserInteractor {
  createUser(input: User): Promise<Pick<User, "user_id" | "username"> | null>;
  deleteUser(user_id: number): Promise<User | null>;
  findUser(identifier: string): Promise<User | null>;
}
