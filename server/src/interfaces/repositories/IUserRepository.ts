import { User } from "@/entities";

export interface IUserRepository {
  createUser(input: User): Promise<Pick<User, "user_id" | "username"> | null>;
  updateUser(user_id: number): Promise<User | null>;
  findUser(input: { user_id?: number; email?: string; username?: string }): Promise<User | null>;
  deleteUser(user_id: number): Promise<User | null>;
}
