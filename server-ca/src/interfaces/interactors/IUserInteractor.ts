import { User } from "@/entities";

export interface IUserInteractor {
  createUser(input: User): Promise<User | null>;
  deleteUser(user_id: number): Promise<User | null>;
  findUser(identifier: string): Promise<User | null>;
}
